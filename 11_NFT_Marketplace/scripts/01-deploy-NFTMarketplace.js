const { ethers, network } = require("hardhat");

async function main() {
    console.log("Starting deployment...");
    console.log(`Deploying contracts to the network: ${network.name}`);

    // Get the contract to deploy
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    console.log("Contract factory for NFTMarketplace retrieved.");

    // Deploy the contract
    console.log("Deploying the NFTMarketplace contract...");
    const nftMarketplace = await NFTMarketplace.deploy();
    console.log("Waiting for the contract to be mined...");
    await nftMarketplace.waitForDeployment();

    const contractAddress = await nftMarketplace.getAddress();
    console.log("✅ Contract deployed successfully!");
    console.log("Contract Address:", contractAddress);

    console.log("Deployment process completed.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed with error:");
        console.error(error);
        process.exit(1);
    });
