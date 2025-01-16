// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {

    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(address indexed seller, address indexed nftAddress, uint256 tokenId, uint256 price);
    event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ItemCancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price > 0) {
            revert NFTMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId, address spender){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if(spender != owner){
            revert NFTMarketplace__NotTheOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId){
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price <= 0){
            revert NFTMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    error NFTMarketplace__PriceMustBeAboveZero();
    error NFTMarketplace__NotApprovedForMarketToSell();
    error NFTMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
    error NFTMarketplace__NotTheOwner();
    error NFTMarketplace__NotListed(address nftAddress, uint256 tokenId);
    error NFTMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 nftPrice, uint256 pricePaid);
    error NFTMarketplace__NotEnoughProceeds();
    error NFTMarketplace__WithdrawalFailed();

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    uint256 private s_listingCount;
    mapping(uint256 => address) private s_listedNftAddresses;
    mapping(uint256 => uint256) private s_listedTokenIds;

    function listNFT(address nftAddress, uint256 tokenId, uint256 price) external 
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if(price <= 0) revert NFTMarketplace__PriceMustBeAboveZero(); 

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)){
            revert NFTMarketplace__NotApprovedForMarketToSell();
        }

        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        s_listedNftAddresses[s_listingCount] = nftAddress;
        s_listedTokenIds[s_listingCount] = tokenId;
        s_listingCount++;
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyNFT(address nftAddress, uint256 tokenId) external payable 
        nonReentrant 
        isListed(nftAddress, tokenId) 
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if(msg.value < listedItem.price){
            revert NFTMarketplace__PriceNotMet(nftAddress, tokenId, listedItem.price, msg.value);
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete s_listings[nftAddress][tokenId];
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external 
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete s_listings[nftAddress][tokenId];
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice) external 
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        if(newPrice <= 0) revert NFTMarketplace__PriceMustBeAboveZero();
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if(proceeds <= 0){
            revert NFTMarketplace__NotEnoughProceeds();
        }    
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if(!success){
            revert NFTMarketplace__WithdrawalFailed();
        }
    }

    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](s_listingCount);
        for (uint256 i = 0; i < s_listingCount; i++) {
            address nftAddress = s_listedNftAddresses[i];
            uint256 tokenId = s_listedTokenIds[i];
            allListings[i] = s_listings[nftAddress][tokenId];
        }
        return allListings;
    }

    function getListingsByOwner(address owner) external view returns (Listing[] memory) {
        uint256 ownerListingCount = 0;
        for (uint256 i = 0; i < s_listingCount; i++) {
            address nftAddress = s_listedNftAddresses[i];
            uint256 tokenId = s_listedTokenIds[i];
            if (s_listings[nftAddress][tokenId].seller == owner) {
                ownerListingCount++;
            }
        }

        Listing[] memory ownerListings = new Listing[](ownerListingCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < s_listingCount; i++) {
            address nftAddress = s_listedNftAddresses[i];
            uint256 tokenId = s_listedTokenIds[i];
            if (s_listings[nftAddress][tokenId].seller == owner) {
                ownerListings[currentIndex] = s_listings[nftAddress][tokenId];
                currentIndex++;
            }
        }
        return ownerListings;
    }

    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}

