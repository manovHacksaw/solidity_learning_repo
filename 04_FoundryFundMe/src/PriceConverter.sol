// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing the Chainlink AggregatorV3Interface for interacting with price feeds
import {AggregatorV3Interface} from "lib/chainlink-brownie-contracts/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// The PriceConverter library provides utility functions for converting ETH amounts to their USD equivalent
library PriceConverter {
    
    // Function to retrieve the latest price of ETH in USD from the Chainlink price feed
    function getPrice() internal view returns (uint256) {
        // Create an instance of the Chainlink price feed contract for ETH/USD
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306 // Address of the Chainlink ETH/USD price feed on Sepolia testnet
        );

        // Retrieve the latest round data from the price feed
        (
            ,                // roundID - not used
            int256 answer,   // The latest price of ETH in USD (scaled by 1e8)
            ,                // startedAt - not used
            ,                // timeStamp - not used
            // answeredInRound - not used
        ) = priceFeed.latestRoundData();

        // Convert the price to match the 1e18 format of ETH (wei)
        // Since 'answer' is scaled by 1e8, multiply by 1e10 to scale it up to 1e18
        return uint256(answer * 1e10);
    }

    // Function to get the version of the Chainlink price feed contract
    function getVersion() internal view returns (uint256) {
        // Return the version of the deployed Chainlink price feed contract
        return AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306 // Address of the Chainlink ETH/USD price feed on Sepolia testnet
        ).version();
    }

    // Function to convert a given amount of ETH to its equivalent USD value
    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        // Get the current price of ETH in USD using the getPrice() function
        uint256 ethPrice = getPrice();

        // Calculate the equivalent USD value of the provided ETH amount
        // ethAmount is in wei, and ethPrice is in USD with 18 decimals, so division by 1e18 normalizes the value
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        // Return the equivalent USD value
        return ethAmountInUsd;
    }
}
