// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SimpleStorage.sol";

contract StorageFactory {
    // Array to store instances of SimpleStorage contracts
    SimpleStorage[] public listOfSimpleStorageContracts;

    // Function to create a new SimpleStorage contract instance
    function createSimpleStorageContract() public returns (SimpleStorage) {
        // Create a new instance of the SimpleStorage contract
        SimpleStorage newSimpleStorageContract = new SimpleStorage();
        
        // Add the new contract instance to the array
        listOfSimpleStorageContracts.push(newSimpleStorageContract);
        
        // Return the instance of the newly created contract
        return newSimpleStorageContract;
    }

    // Function to store a value in a specific SimpleStorage contract instance
    function sfStore(uint256 _simpleStorageIndex, uint256 _newSimpleStorageNumber) public {
        // Retrieve the SimpleStorage contract instance from the array by index
        SimpleStorage mySimpleStorage = listOfSimpleStorageContracts[_simpleStorageIndex];
        
        // Call the `store` function of the selected SimpleStorage contract to store the new number
        mySimpleStorage.store(_newSimpleStorageNumber);
    }

    // Function to retrieve the stored value from a specific SimpleStorage contract instance
    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256) {
        // Retrieve the SimpleStorage contract instance from the array by index
        SimpleStorage mySimpleStorage = listOfSimpleStorageContracts[_simpleStorageIndex];
        
        // Call the `retrieve` function of the selected SimpleStorage contract and return the stored value
        return mySimpleStorage.retrieve();
    }
}
