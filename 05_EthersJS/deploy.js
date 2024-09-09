const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

async function main() {
    // Provider and wallet setup from environment variables
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Wallet address: ", wallet.address);

    const abi = JSON.parse(fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8"));
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    // Optional: Set deployment options
    const deployOptions = {
        gasLimit: 3000000, // Increased gas limit to ensure deployment success
    };

    try {
        // Deploy the contract
        const contract = await contractFactory.deploy(deployOptions);
        console.log('Deploying contract...');

        // Wait for the contract deployment to be mined
        const deploymentTxReceipt = await contract.deploymentTransaction().wait();
        console.log('Contract deployed at address:', contract.address);
        console.log('Deployment Receipt:', deploymentTxReceipt);

        // Retrieve the initial favorite number
        let currentFavouriteNumber = await contract.retrieve();
        console.log("Initial Favourite Number:", currentFavouriteNumber.toString());

        // Store a new favorite number
        const numberToStore = 42;
        console.log("Storing new favourite number:", numberToStore);
        const storeTxResponse = await contract.store(numberToStore); // Call the store function
        await storeTxResponse.wait(); // Wait for the transaction to be mined

        // Retrieve the updated favorite number
        currentFavouriteNumber = await contract.retrieve();
        console.log("Updated Favourite Number:", currentFavouriteNumber.toString());

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.error('Error in main:', err);
    process.exit(1);
});
