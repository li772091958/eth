/*
 * @Author: aliyuntao
 * @LastEditors: aliyuntao
 * @Date: 2022-07-31 16:25:05
 * @LastEditTime: 2022-08-01 21:31:37
 * @FilePath: /eth/gen-address/index.js
 *
 */
var cluster = require('cluster');
var cpuNum = require('os').cpus().length;
var getWallet = require('./getWallet');

const pids = [];

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNum; i++) {
    const worker = cluster.fork();
    const pid = worker.process.pid;
    pids.push(pid);
    worker.send(pid);
  }

  cluster.on('message', function (worker, { privateKey, address, count }) {
    console.log(
      'worker【' + worker.process.pid + '】detected ' + count + ' times'
    );
    console.log('privateKey: ', privateKey);
    console.log('address', address);
    pids.forEach(v => process.kill(v));
    process.exit();
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  process.on('message', msg => {
    console.log('worker', msg, 'start');
    const data = getWallet(/^0x0{2}[0-9a-fA-F]+0{2}$/);
    process.send(data);
  });
}
