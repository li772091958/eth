# 生成靓号 ETH 地址

## 功能说明

按照自己需要的格式，生成 ETH 地址，并将对应私钥加密后，保存在本地日志，也支持实时推送到钉钉或者微信

如果找到合适的地址想要使用，必须通过本脚本，对私钥解密

## 配置文件

`/src/config/index.js`里面，按照注释，填写对应的配置：

注意该配置文件的安全性

1. aes 加密算法的 key 值

为了防止私钥泄露，这里将生成的私钥做了加密处理。必须按照格式填写，长度为 32 位的 16 进制字符串，并且需要记住该字符串，解密时也需要用到。

2. 钉钉机器人的 access_token
   如果不需要，则可以忽略该配置，置空就行

[钉钉机器人官方教程](https://open.dingtalk.com/document/group/robot-overview)

3. 微信 server 酱推
   如果不需要，则可以忽略该配置，置空就行

[server 酱](https://sct.ftqq.com/)

## 运行脚本

1. 按照需要修改`src/gen-address/index.js`101 行的正则表达式

下面给出了几个简单示例，自行参考

```javascript
// 6个或以上的0开头，0x000000*****
const reg = /^0x0{6,}/;

// 4个0开头，并且4个0结尾，0x0000*****0000
const reg = /^0x0{4}[0-9a-fA-F]+0{4}/;

// abcd开头，并且dcba结尾，0x0000*****0000
const reg = /^0x0{4}[0-9a-fA-F]+0{4}/;
```

getWallet 的参数，还可以是指定子字符串

```javascript
// 地址中间包含字符串 20200804
const subStr = '20220804';
getWallet(reg);
```

2. 运行程序

`src/gen-address/index.js`第 12 行 cpuNum 这里写成了固定的 2，可以按照自己电脑或者服务器配置的实际情况改一下

```
pm2 start src/gen-address/index.js --name gen-address
```

通过命令`pm2 show gen-address`，查看程序运行状态，status 为绿色的 online，表示运行正常

查看程序实时日志，`tail -f /root/.pm2/logs/main-out.log`，可以看到每个 worker 计算的累积次数

如下，表示开启了两个 worker，中括号里面代表 worker 的 pid，每个 worker 都筛选了 600 多万个地址

```
【21926】 6340000 times
【21932】 6035000 times
【21926】 6345000 times
【21932】 6040000 times
【21926】 6350000 times
【21932】 6045000 times
【21926】 6355000 times
【21932】 6050000 times
【21926】 6360000 times
【21932】 6055000 times
【21926】 6365000 times
【21932】 6060000 times
```

# 解密私钥

所有符合条件的结果，都会记录在本地的日志文件里，`logs/response/`目录下，按日分开存储

```
[2022-08-04T21:29:17.135] [INFO] response - {"address":"0x0000F4C87E8B6BEF172Bd6E92f446fC2Bb498e2C","p":"b6840fad141ba5bc40e7a599549e71ee09099362364034a6577a2f0ee591b9a7d8cec0be4466f2733a795d7b01cdeaf389e290bf36ca721ac8339e3e788422694c833c71c42611488383a3fcbdd78c55","i":"7d7036bdb1e8e8ce15e748f10d114bcb"}
```

上面示例表示找到的一条符合条件的地址，并且对应的私钥也做了加密处理

一条记录里面分别记录了：

> - address: ETH 地址，明文
> - p: 私钥，密文
> - i: 使用 aes 加密算法时随机生成的初始向量

使用`tools/decrypt.js [p] [i]`对私钥进行解密

```
node tools/decrypt.js b6840fad141ba5bc40e7a599549e71ee09099362364034a6577a2f0ee591b9a7d8cec0be4466f2733a795d7b01cdeaf389e290bf36ca721ac8339e3e788422694c833c71c42611488383a3fcbdd78c55 7d7036bdb1e8e8ce15e748f10d114bcb
```

运行上面的命令，将会输出 privateKey 明文和 address

<span style={{color:red;}}>对于明文私钥，切记注意安全</span>
<span style={{color:red;}}>一旦泄露，这个钱包地址就废弃不要再使用了</span>
