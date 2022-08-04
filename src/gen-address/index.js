/*
 * @Author: aliyuntao
 * @LastEditors: aliyuntao
 * @Date: 2022-08-04 10:25:22
 * @LastEditTime: 2022-08-04 22:54:31
 * @FilePath: /eth/src/gen-address/index.js
 *
 */
import cluster from 'cluster';
import { encrypt } from '../lib/aes.js';
import logger from '../lib/logger.js';
import request from '../lib/request.js';
import { dingding, serverJong } from '../config/index.js';
import getWallet from './generate.js';

var cpuNum = 2;

const pids = [];

function writeResultLog(data) {
  const { privateKey, address, count } = data;
  const { text, iv } = encrypt(privateKey);
  const message = { address, p: text, i: iv };
  logger.info(JSON.stringify(message));
}

function sendDingding(data) {
  if (!dingding.access_token) {
    console.log('未配置钉钉机器人');
    return;
  }
  const { privateKey, address, count } = data;
  const { text, iv } = encrypt(privateKey);
  const body = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      title: address,
      text: `### ${address}\n - **加密后私钥** ${text} \n - **初始向量** ${iv}`,
    },
    at: { isAtAll: true },
  });

  return request(
    `https://oapi.dingtalk.com/robot/send?access_token=${dingding.access_token}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      dataType: 'json',
    }
  ).then(res => {
    console.log(JSON.stringify(res));
  });
}

function sendWechat(data) {
  if (!serverJong.SendKey) {
    console.log('未配置Server酱');
    return;
  }
  const { privateKey, address } = data;
  const { text, iv } = encrypt(privateKey);
  const desp = `### 加密后私钥 \n ${text}  ### 初始向量 \n ${iv}`;
  const body = new URLSearchParams();
  body.append('title', address);
  body.append('desp', desp);

  return request(`https://sctapi.ftqq.com/${serverJong.SendKey}.send`, {
    method: 'POST',
    body,
  }).then(res => {
    console.log(JSON.stringify(res));
  });
}

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNum; i++) {
    const worker = cluster.fork();
    const pid = worker.process.pid;
    pids.push(pid);
    worker.send(pid);
  }

  cluster.on('message', function (worker, msg) {
    if (!msg || !msg.count || !msg.privateKey || !msg.address) {
      console.log(msg);
      return;
    }
    console.log(
      'worker【' + worker.process.pid + '】detected ' + msg.count + ' times'
    );
    writeResultLog(msg);
    sendDingding(msg);
    sendWechat(msg);
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  const reg = /^0x0{6,}/;
  getWallet(reg);
}
