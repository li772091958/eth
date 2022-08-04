export const aes = {
  // 加密算法，不用修改
  algorithm: 'aes-256-cbc',
  // aes加密的key，长度为32位的16进制
  key: '',
};

export const dingding = {
  // 配置钉钉机器人的access_token，不需要钉钉推送则不管
  access_token: '',
};

export const serverJong = {
  // 配置server酱的sendKey，不需要微信推送则不管
  SendKey: '',
};

export default { aes, dingding, serverJong };
