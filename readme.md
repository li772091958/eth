# ETH 玩一下

## 环境准备

1. 安装 node
2. 下载源码并安装依赖

```
  git clone https://github.com/li772091958/eth.git
  cd eth
  npm i
```

## gen-address

利用多线程，生成特定格式的 ETH 靓号地址
修改`/src/gen-address/index.js`第 31 行的正则
示例中表示 `0x00******00` 的格式，即以 00 开头和结尾的

```javascript
const data = getWallet(/^0x0{2}[0-9a-fA-F]+0{2}$/);
```

运行`node src/gen-address`
