require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Make sure to load environment variables

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`], // Ensure PRIVATE_KEY is prefixed with 0x
      chainId: 11155111
    },
  },
  solidity: "0.8.24",
};
