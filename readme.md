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
修改`/gen-address/index.js`第 31 行的正则
示例中表示 `0x00******00` 的格式，即以 00 开头和结尾的

```javascript
const data = getWallet(/^0x0{2}[0-9a-fA-F]+0{2}$/);
```

运行`node gen-address`

输出如下内容，表示开启了 8 个 worker，并且 pid 为 1865 的 worker，生成的第 5137 个地址符合要求

```
worker 1860 start
worker 1863 start
worker 1861 start
worker 1862 start
worker 1864 start
worker 1866 start
worker 1865 start
worker 1867 start
【1860】 5000 times
【1861】 5000 times
【1862】 5000 times
【1863】 5000 times
【1865】 5000 times
【1866】 5000 times
【1867】 5000 times
【1864】 5000 times
worker【1865】detected 5137 times
privateKey:  0xdef64d24047a5d05d3df886a26abdae79db57539f648a5f66b226999d3a888ef
address 0x0079d6ea8548d35B445E3c83bd80b163BC216200
```
