const log4js = require('log4js') // 引入 log4js

log4js.configure({
  appenders: {
    error: {
      category: 'errorLogger', // logger 名称
      type: 'dateFile', // 日志类型
      filename: 'logs/error/error', // 日志输出位置
      alwaysIncludePattern: true, // 是否有后缀名
      pattern: 'yyyy-MM-dd-hh.log', // 后缀 每一小时创建一个新的日志文件
    },
    response: {
      category: 'responseLogger',
      type: 'dateFile',
      filename: 'logs/response/response',
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd-hh.log'
    }
  },
  categories: {
    error: {
      appenders: ['error'],
      level: 'error'
    },
    response: {
      appenders: ['response'],
      level: 'info',
    },
    default: {
      appenders: ['response', 'error'],
      level: 'error'
    }
  }
})

const logger = log4js.getLogger('response')
module.exports = logger
