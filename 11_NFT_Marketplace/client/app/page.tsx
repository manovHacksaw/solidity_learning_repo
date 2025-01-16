"use client"

import { useMarketplaceContext } from "@/context/MarketplaceProvider";
import { NFT_CONTRACT_ADDRESS } from "@/lib/constants";
import { formatIPFSUrl } from "@/lib/ipfs";
import { User, Wallet } from 'lucide-react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NFTListing {
  name: string;
  description: string;
  image: string;
  tokenId: string;
  price: string;
  seller: string;
  nftAddress: string;
  tokenURI: string;
}

function App() {
  const { account, connectWallet, isLoading, getAllListings, buyNFT } = useMarketplaceContext();
  const [nftListings, setNftListings] = useState<NFTListing[]>([]);
  const [buyingNFT, setBuyingNFT] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const listings = await getAllListings();
        console.log("######", listings);

        const updatedListings: NFTListing[] = [];

        for (let index = 0; index < listings.length; index++) {
          const ipfsHash = await fetch(formatIPFSUrl(listings[index].tokenURI));
          console.log(ipfsHash.url);

          const metaDataUrl = ipfsHash.url;

          const response = await fetch(metaDataUrl);
          const nftData = await response.json();
          console.log(nftData);

          updatedListings.push({
            name: nftData.name,
            description: nftData.description,
            image: formatIPFSUrl(nftData.image),
            tokenId: listings[index].tokenId,
            price: listings[index].price,
            seller: listings[index].seller,
            nftAddress: listings[index].nftAddress,
            tokenURI: listings[index].tokenURI
          });
        }

        console.log("FINAL NFT LISTINGS: ", updatedListings);
        setNftListings(updatedListings);
      } catch (error) {
        console.error('Error fetching NFT listings:', error);
      }
    };

    if (account) {
      fetchNFTs();
    }
  }, [account, getAllListings]);

  const handleBuy = async (tokenId: string, price: string) => {
    try {
      setBuyingNFT(tokenId);
      await buyNFT(NFT_CONTRACT_ADDRESS, Number(tokenId), price);
      console.log(`Successfully bought NFT with tokenId: ${tokenId} for ${price} ETH`);
      // Refresh the listings after purchase
      const listings = await getAllListings();
      setNftListings(listings);
    } catch (error) {
      console.error(`Error buying NFT with tokenId: ${tokenId}:`, error);
    } finally {
      setBuyingNFT(null);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to NFT Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-400 mb-6">Connect your wallet to start exploring NFTs</p>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : nftListings.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">No NFTs Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-400">There are currently no NFTs listed for sale</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-white">Available NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nftListings.map((nft) => (
                <Card key={nft.tokenId} className="bg-gray-800 border-gray-700 overflow-hidden hover:border-purple-500 transition-colors">
                  <CardHeader className="p-0">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-56 object-cover bg-gray-700"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="font-semibold text-white truncate mb-2">{nft.name}</CardTitle>
                    <p className="text-gray-400 text-sm truncate mb-4">{nft.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-purple-400">
                        {nft.price} ETH
                      </Badge>
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="h-4 w-4 mr-1" />
                        <span>{`${nft.seller.slice(0, 6)}...${nft.seller.slice(-4)}`}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleBuy(nft.tokenId, nft.price)}
                      disabled={buyingNFT === nft.tokenId}
                    >
                      {buyingNFT === nft.tokenId ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Buying...
                        </span>
                      ) : (
                        'Buy Now'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

