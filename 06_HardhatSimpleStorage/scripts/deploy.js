const { ethers } = require('hardhat');

async function main(params) {

     const SimpleStorageContractFactory = await ethers.getContractFactory("SimpleStorage");
     console.log("Deploying Contract...")
     const simpleStorage = SimpleStorageContractFactory.deploy();
     (await simpleStorage).waitForDeployment()

     const contractAddress = await simpleStorage.address;

     console.log("Deployed contract to: ", contractAddress )

}

main().then((result) => {
     process.exit(0);
}).catch((err) => {
     console.error(err);
     process.exit(1);
});