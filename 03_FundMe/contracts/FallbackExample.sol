// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// FallbackExample contract demonstrates the use of the receive and fallback functions
contract FallbackExample {
    // State variable to store a result
    uint256 public result;

    // The receive function is a special function in Solidity that is triggered 
    // when the contract receives ETH without any data
    receive() external payable {
        // When ETH is sent to this contract without any data, this function is executed
        result = 1;  // Sets the result to 1 whenever this contract receives ETH with no data
    }

    // The fallback function is a special function in Solidity that is triggered 
    // when the contract receives data or an unknown function is called
    fallback() external payable {
        // When ETH is sent to this contract with data or an unknown function is called,
        // this function is executed
        result = 2;  // Sets the result to 2 whenever this contract receives ETH with data or an unknown function is called
    }
}
