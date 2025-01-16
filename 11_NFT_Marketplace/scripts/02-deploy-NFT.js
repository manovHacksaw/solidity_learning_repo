const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MyNFT = await ethers.getContractFactory("NFT");

  // Deploy the contract with the name and symbol
  const myNFT = await MyNFT.deploy();

  // Wait for the deployment transaction to be mined
  await myNFT.waitForDeployment(1);

  console.log("NFT deployed to:", await myNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
