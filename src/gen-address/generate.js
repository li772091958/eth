import { ethers } from 'ethers';
import crypto from 'crypto'

export function generate() {
  const id = crypto.randomBytes(32).toString('hex');
  const privateKey = '0x' + id;
  const { address } = new ethers.Wallet(privateKey);
  return { privateKey, address };
}

export function getWallet(val) {
  let count = 0;

  while (true) {
    const { privateKey, address } = generate();

    count += 1;

    let flag = false
    if (typeof val === 'string' && address.indexOf(val)) flag = true
    if (val instanceof RegExp && val.test(address)) flag = true
    if (val instanceof Function && test(address)) flag = true

    if (flag) process.send({ privateKey, address, count })

    if (count % 5_000 === 0) console.log('【' + process.pid + '】', count, 'times');
  }
}

export default getWallet;