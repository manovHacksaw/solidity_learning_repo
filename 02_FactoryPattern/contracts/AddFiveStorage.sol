// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SimpleStorage} from "./SimpleStorage.sol";

// Inheriting from the SimpleStorage contract
contract AddFiveStorage is SimpleStorage {
    
    // Simple function to return a greeting string
    function sayHello() public pure returns (string memory) {
        return "Namaste!";
    }

    // Overriding the `store` function from SimpleStorage to add 5 to the input number
    function store(uint256 _newNumber) public override {
        myfavouriteNumber = _newNumber + 5;  // Store the number plus 5 instead of the exact input
    }
}
