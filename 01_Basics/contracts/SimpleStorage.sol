// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint256 public myfavouriteNumber;

    function store(uint256 _favouriteNumber) public {
        myfavouriteNumber = _favouriteNumber;
        retrieve();
        
    }

    struct Person{
        uint256 favouriteNumber;
        string name;
    }

    uint256[] listOfFavouriteNumbers;

    // Person public raj = Person(5, "sharma");
    // Person public aakash = Person({
    //     favouriteNumber :12, name: "Aakash Mandal"
    // });

    //dynamic array 
    Person[] public listOfPeople; // []

    //static array
    // Person[] public listOfPeople; 

    //calldata -> temporary variables that CANNOT be modified
    //memory -> temporary variables that CAN be modified
    //storage -> permanent variables that CAN be modified
    
    //view - only read state from blockchain
    function retrieve() public view returns(uint256) {
        return myfavouriteNumber;
    }

    mapping(string => uint256) public nameToFavouriteNumber;

    function addPerson(string memory _name, uint256 _number) public {
        nameToFavouriteNumber[_name] = _number;
        listOfPeople.push(Person(_number, _name));
    }

}
