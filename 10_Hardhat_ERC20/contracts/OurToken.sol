// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    // Constructor mints an initial supply of tokens to the deployer
    constructor(uint256 initialSupply) ERC20("Our Token", "OT") {
        // Multiply the initial supply by 10^18 to account for decimals
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
