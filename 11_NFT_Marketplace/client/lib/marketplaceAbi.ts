const marketplaceMetadata= {
	"compiler": {
		"version": "0.8.28+commit.7893614a"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "NFTMarketplace__AlreadyListed",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "NFTMarketplace__NotApprovedForMarketToSell",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "NFTMarketplace__NotEnoughProceeds",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "NFTMarketplace__NotListed",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "NFTMarketplace__NotTheOwner",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "NFTMarketplace__PriceMustBeAboveZero",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nftPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePaid",
						"type": "uint256"
					}
				],
				"name": "NFTMarketplace__PriceNotMet",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "NFTMarketplace__WithdrawalFailed",
				"type": "error"
			},
			{
				"inputs": [],
				"name": "ReentrancyGuardReentrantCall",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"name": "ItemBought",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ItemCancelled",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"name": "ItemListed",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "buyNFT",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "cancelListing",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getAllListings",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							}
						],
						"internalType": "struct NFTMarketplace.Listing[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getListing",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							}
						],
						"internalType": "struct NFTMarketplace.Listing",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "getListingsByOwner",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							}
						],
						"internalType": "struct NFTMarketplace.Listing[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					}
				],
				"name": "getProceeds",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"name": "listNFT",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "newPrice",
						"type": "uint256"
					}
				],
				"name": "updateListing",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "withdrawProceeds",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		"devdoc": {
			"errors": {
				"ReentrancyGuardReentrantCall()": [
					{
						"details": "Unauthorized reentrant call."
					}
				]
			},
			"kind": "dev",
			"methods": {},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"contracts/NFTMarketplace.sol": "NFTMarketplace"
		},
		"evmVersion": "paris",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": false,
			"runs": 200
		},
		"remappings": []
	},
	"sources": {
		"@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			"keccak256": "0x5dc63d1c6a12fe1b17793e1745877b2fcbe1964c3edfd0a482fac21ca8f18261",
			"license": "MIT",
			"urls": [
				"bzz-raw://6b7f97c5960a50fd1822cb298551ffc908e37b7893a68d6d08bce18a11cb0f11",
				"dweb:/ipfs/QmQQvxBytoY1eBt3pRQDmvH2hZ2yjhs12YqVfzGm7KSURq"
			]
		},
		"@openzeppelin/contracts/utils/ReentrancyGuard.sol": {
			"keccak256": "0x11a5a79827df29e915a12740caf62fe21ebe27c08c9ae3e09abe9ee3ba3866d3",
			"license": "MIT",
			"urls": [
				"bzz-raw://3cf0c69ab827e3251db9ee6a50647d62c90ba580a4d7bbff21f2bea39e7b2f4a",
				"dweb:/ipfs/QmZiKwtKU1SBX4RGfQtY7PZfiapbbu6SZ9vizGQD9UHjRA"
			]
		},
		"@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			"keccak256": "0x79796192ec90263f21b464d5bc90b777a525971d3de8232be80d9c4f9fb353b8",
			"license": "MIT",
			"urls": [
				"bzz-raw://f6fda447a62815e8064f47eff0dd1cf58d9207ad69b5d32280f8d7ed1d1e4621",
				"dweb:/ipfs/QmfDRc7pxfaXB2Dh9np5Uf29Na3pQ7tafRS684wd3GLjVL"
			]
		},
		"contracts/NFTMarketplace.sol": {
			"keccak256": "0xe5ab21ec6787c85c90e17c3c9def2c0068f5faa553e74a07eb2e970e1aa402ac",
			"license": "MIT",
			"urls": [
				"bzz-raw://b701716ef911eed03d503e0d5b51d691f2bc4b01b9086fb75245216063e1101d",
				"dweb:/ipfs/QmZncpvGMdMhoyNkBrsDgg3yg2qFUvZLJXZQDgTigUYPz7"
			]
		}
	},
	"version": 1
}
  
  
  
export default marketplaceMetadata.output.abi;