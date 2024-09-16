const hre = require('hardhat');

async function main(){

     const Voting = await hre.ethers.getContractFactory("Voting");
     
     const voting = await Voting.deploy(["Mark", "Henry", "Rock", "Mike"], 90);

     await voting.waitForDeployment();

     const contractAddress = await voting.getAddress();
     
     console.log("Deployed the contract at: ", contractAddress);


}

main().catch((error) => {
     console.error(error);
     process.exit(1); 
 })