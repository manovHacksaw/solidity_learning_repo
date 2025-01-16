// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721URIStorage {
    
    uint public tokenCount;

    constructor() ERC721("NFT", "NFM") {
        tokenCount = 0;
    }

    // Mint function to create a new NFT and set its token URI
    function mint(string memory _tokenURI) external returns (uint) {
      uint256 newItemId = tokenCount;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        tokenCount = tokenCount + 1;
        return newItemId;
    }

    // // Override `tokenURI` to ensure it works correctly
    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     // Check if the token exists
    //     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
    //     // Return the token URI (stored in ERC721URIStorage)
    //     return super.tokenURI(tokenId);
    // }

    // // Override `_baseURI` if you want a custom base URI
    // function _baseURI() internal view override returns (string memory) {
    //     return "https://example.com/metadata/";
    // }

    // // Override `supportsInterface` to ensure compatibility with tools
    // function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }
}
