// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SimpleStorage {
    // State variable to store a favorite number
    uint256 public myfavouriteNumber;

    // Function to store a new favorite number; can be overridden by child contracts
    function store(uint256 _favouriteNumber) public virtual {
        myfavouriteNumber = _favouriteNumber;
        retrieve(); // Call retrieve function to return the stored value (optional in this context)
    }

    // Structure to store a person's name and their favorite number
    struct Person {
        uint256 favouriteNumber;
        string name;
    }

    // Dynamic array to store a list of favorite numbers (not used in this example)
    uint256[] listOfFavouriteNumbers;

    // Dynamic array to store a list of people
    Person[] public listOfPeople; // []

    // View function to retrieve the stored favorite number without modifying the state
    function retrieve() public view returns (uint256) {
        return myfavouriteNumber;
    }

    // Mapping to associate a person's name with their favorite number
    mapping(string => uint256) public nameToFavouriteNumber;

    // Function to add a person to the list and map their name to their favorite number
    function addPerson(string memory _name, uint256 _number) public {
        nameToFavouriteNumber[_name] = _number; // Update the mapping
        listOfPeople.push(Person(_number, _name)); // Add a new person to the list
    }
}