const { ethers } = require('hardhat');

async function main() {
     console.log("Initializing contract deployment...");

     // Get the deployer's signer (first account in the list of signers)
     
     const [deployer] = await ethers.getSigners();
     console.log("Deployer address:", deployer.address);

     // Get the contract factory for 'NFTMarketplace'
     const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
     console.log("Contract factory for 'NFTMarketplace' retrieved.");

     console.log("Deploying the contract...");
     const nftMarketplace = await NFTMarketplace.deploy();

     console.log("Waiting for the deployment to be confirmed...");
     await nftMarketplace.waitForDeployment();

     // Get the deployed contract address
     const contractAddress = await nftMarketplace.getAddress();
     console.log("NFT Marketplace contract deployed successfully!");
     console.log("Contract Address:", contractAddress);

     // Fetch the deployer's balance after deployment
     const deployerBalance = await ethers.provider.getBalance(deployer.address);
     // Format the balance to Ether
     const formattedBalance = ethers.formatEther(deployerBalance);

     console.log(`Deployer's balance: ${formattedBalance} ETH`);
}

main()
     .then(() => {
          console.log("Deployment script executed successfully.");
          process.exit(0);
     })
     .catch(error => {
          console.error("Error during deployment:", error);
          process.exit(1);
     });
