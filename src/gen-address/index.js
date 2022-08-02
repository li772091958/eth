var cluster = require('cluster')
var logger = require('../lib/logger')
var { encrypt } = require('../lib/aes')

// var cpuNum = require('os').cpus().length
var cpuNum = 4
var getWallet = require('./generate')

const pids = []

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNum; i++) {
    const worker = cluster.fork()
    const pid = worker.process.pid
    pids.push(pid)
    worker.send(pid)
  }

  cluster.on('message', function (worker, { privateKey, address, count }) {
    console.log('worker【' + worker.process.pid + '】detected ' + count + ' times')
    const { text, iv } = encrypt(privateKey)
    const message = { p: text, i: iv, address }
    logger.info(JSON.stringify(message))
  })

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died')
  })

} else {
  process.on('message', (msg) => {
    console.log('worker', msg, 'start')
    const data = getWallet(/^0x([Aa]9){2}[0-9a-fA-F]+([Aa]9){2}/)
    process.send(data)
  })
}