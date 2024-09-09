// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing the Chainlink AggregatorV3Interface for interacting with price feeds
import {AggregatorV3Interface} from "lib/chainlink-brownie-contracts/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// Importing the PriceConverter library to convert ETH to USD
import {PriceConverter} from "./PriceConverter.sol";

error NotOwner();

// FundMe contract allows users to send ETH if the value meets a minimum USD threshold
contract FundMe {
    // Using the PriceConverter library for uint256 type
    using PriceConverter for uint256;

    // State variable to track a custom value (for demonstration purposes)
    uint256 public myValue = 1;

    // Array to store addresses of funders
    address[] public funders;

    // Mapping to track the amount of ETH funded by each address
    mapping(address => uint256) public addressToAmountFunded;

    // Owner of the contract
    // immutable for gas optimization
    address public immutable i_owner;

    // Minimum USD amount required to fund the contract (in wei, the smallest unit of ETH)
    // constant for gas optimization
    uint256 public constant MINIMUM_USD = 5e18; // 5 USD expressed in wei

    // Constructor that sets the owner of the contract to the deployer
    constructor() {
        i_owner = msg.sender;
    }

    // Function to fund the contract
    function fund() public payable {
        // Increment the custom value by 2 every time this function is called
        myValue = myValue + 2;

        // Ensure the ETH sent is at least equivalent to the minimumUSD
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough ETH"
        );

        // Record the sender's address and the amount of ETH sent
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    // Function to withdraw all funds from the contract
    function withdraw() public onlyOwner {
        // Reset the funded amount for each funder to 0
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        // Reset the funders array
        funders = new address[](0);

        // Withdraw all the funds using the call method, which is the safest way to send ETH
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Transaction failed");
    }

    // Modifier to restrict access to the owner of the contract
    modifier onlyOwner() {
        //gas efficient way
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
