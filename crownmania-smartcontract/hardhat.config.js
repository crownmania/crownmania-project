require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygon: {
      url: 'https://polygon-mainnet.g.alchemy.com/v2/EUpP3mgIWI7KBMxn-2DFMjRLRMzKU2f3',
      accounts: ['0xfb88cc443240316eb8217de5b75a40044dbdc53bebd6f935805a9d1f57f9efa2'],
    },
  },
  etherscan: {
    apiKey: "ACHJKBYEYR8FZK5NFI3WN5NZNM7AT32USQ",
  },
};