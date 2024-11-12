// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract NFTMarketplace is ReentrancyGuard {
    // Struct to store each NFT listing's details
    struct Listing {
        uint256 price;
        address seller;
    }

    // Events to emit on significant actions
    event NFTListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );
    event NFTSold(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address indexed buyer
    );
    event ListingCancelled(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller
    );
    event FundsWithdrawn(address indexed seller, uint256 amount);

    // Mapping of NFT contract address => NFT ID => Listing
    mapping(address => mapping(uint256 => Listing)) private listings;

    // Seller address => Amount earned
    mapping(address => uint256) private s_proceeds;

    // Modifier to check if the caller is the owner of the NFT
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == spender, "Caller is not the owner");
        _;
    }

    // Modifier to check if the NFT is listed
    modifier isListed(address nftAddress, uint256 tokenId) {
        require(listings[nftAddress][tokenId].price > 0, "NFT is not listed");
        _;
    }

    // Function to list an NFT
    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external isOwner(nftAddress, tokenId, msg.sender) {
        require(price > 0, "Price must be above zero");

        IERC721 nft = IERC721(nftAddress);
        require(
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved for NFT"
        );

        listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit NFTListed(nftAddress, tokenId, price, msg.sender);
    }

    // Function to buy an NFT
    function buyNFT(
        address nftAddress,
        uint256 tokenId
    ) external payable isListed(nftAddress, tokenId) nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];
        require(msg.value == listing.price, "Incorrect price");

        // Add the payment to the seller's proceeds balance
        s_proceeds[listing.seller] += msg.value;

        // Transfer NFT ownership to the buyer
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        // Remove the listing
        delete listings[nftAddress][tokenId];

        emit NFTSold(nftAddress, tokenId, listing.price, msg.sender);
    }

    // Function to cancel a listing
    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
        delete listings[nftAddress][tokenId];
        emit ListingCancelled(nftAddress, tokenId, msg.sender);
    }

    // Function to withdraw accumulated proceeds
    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        require(proceeds > 0, "No proceeds to withdraw");

        // Reset the seller's proceeds to zero before transferring
        s_proceeds[msg.sender] = 0;

        // Transfer the proceeds to the seller
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(msg.sender, proceeds);
    }

    // Function to get listing details
    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return listings[nftAddress][tokenId];
    }

    // Function to get the seller's proceeds balance
    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
