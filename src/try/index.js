import { ethers, utils } from 'ethers'

let address = "0x0E400b23cbB2E24Ce5d6981ff0AC3f07A22978Ca";

let etherscanProvider = new ethers.providers.EtherscanProvider();

etherscanProvider.getHistory(address).then((history) => {
  history.forEach((tx) => {
    console.log(tx);
  })
});
