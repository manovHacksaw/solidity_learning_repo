"use client"

import { useMarketplaceContext } from "@/context/MarketplaceProvider";
import { User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const { account, connectWallet, isLoading, getAllListings, buyNFT } = useMarketplaceContext();
  const [nftListings, setNftListings] = useState<{ tokenId: string; price: string; seller: string; nftAddress: string }[]>([]);
  const [buyingNFT, setBuyingNFT] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const listings = await getAllListings();
        console.log(listings)
        setNftListings(listings);
      } catch (error) {
        console.error('Error fetching NFT listings:', error);
      }
    };

    if (account) {
      fetchNFTs();
    }
  }, [account]);

  const handleBuy = async (tokenId: string, price: string, nftAddress: string) => {
    try {
      setBuyingNFT(tokenId);
      await buyNFT(nftAddress, parseInt(tokenId), price);
      console.log(`Successfully bought NFT with tokenId: ${tokenId} for ${price} ETH`);
      // Refresh the listings after purchase
      const updatedListings = await getAllListings();
      setNftListings(updatedListings);
    } catch (error) {
      console.error(`Error buying NFT with tokenId: ${tokenId}:`, error);
    } finally {
      setBuyingNFT(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">NFT Marketplace</span>
            </div>
            <div className="flex items-center">
              {account ? (
                <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
                  <Wallet className="h-5 w-5 mr-2" />
                  <span>{formatAddress(account)}</span>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!account ? (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to NFT Marketplace</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to start exploring NFTs</p>
            <button
              onClick={connectWallet}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : nftListings.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No NFTs Available</h2>
            <p className="text-gray-400">There are currently no NFTs listed for sale</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-8">Available NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nftListings.map((listing, index) => (
                <div
                  key={listing.tokenId}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
                >
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`https://source.unsplash.com/random/400x400?nft&sig=${index}`}
                      alt={`NFT ${listing.tokenId}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">NFT #{listing.tokenId}</h3>
                      <span className="text-purple-400">{listing.price} ETH</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{formatAddress(listing.seller)}</span>
                    </div>
                    <button
                      onClick={() => handleBuy(listing.tokenId, listing.price, listing.nftAddress)}
                      disabled={buyingNFT === listing.tokenId}
                      className={`w-full mt-2 px-4 py-2 rounded-lg transition-colors ${
                        buyingNFT === listing.tokenId
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {buyingNFT === listing.tokenId ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Buying...
                        </span>
                      ) : (
                        'Buy Now'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

