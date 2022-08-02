/*
 * @Author: aliyuntao
 * @LastEditors: aliyuntao
 * @Date: 2022-08-02 16:41:43
 * @LastEditTime: 2022-08-02 20:40:19
 * @FilePath: /eth/src/lib/aes.js
 *
 */
const crypto = require('crypto');
const {
  aes: { key, algorithm },
} = require('../config');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    text: encrypted.toString('hex'),
  };
}

function decrypt(text, ivHexStr) {
  let iv = Buffer.from(ivHexStr, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
