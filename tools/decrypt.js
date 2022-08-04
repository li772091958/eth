import { decrypt } from '../src/lib/aes.js'
import { ethers } from 'ethers'

const [text, ivHexStr] = process.argv.splice(2)

if (!text || !ivHexStr) {
  console.error('缺少参数')
} else {
  try {
    const privateKey = decrypt(text, ivHexStr)
    const { address } = new ethers.Wallet(privateKey);
    console.log('privateKey: ', privateKey)
    console.log('address: ', address)
  } catch (e) {
    console.error(e)
  }
}