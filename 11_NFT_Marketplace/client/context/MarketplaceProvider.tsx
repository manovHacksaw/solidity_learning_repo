"use client"
import { ethers } from 'ethers';
import { createContext, ReactNode, useContext, useState } from 'react';
import marketplaceAbi from '@/lib/marketplaceAbi';
import { NFT_CONTRACT_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS, REQUIRED_NETWORK } from '@/lib/constants';
import NFTabi from '@/lib/nftAbi';

interface NFTListing {
  tokenId: string;
  price: string;
  tokenURI: string | null;
  seller?: string;
  nftAddress?: string;
}

interface MarketplaceContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  listNFT: (nftAddress: string, tokenId: number, price: string) => Promise<void>;
  mintNFT: (tokenURI: string) => Promise<{ tokenId: number; nftAddress: string }>;
  getNFTs: () => Promise<NFTListing[]>;
  getAllListings: () => Promise<NFTListing[]>;
  getListingsByOwner: (owner: string) => Promise<NFTListing[]>;
  getListing: (nftAddress: string, tokenId: number) => Promise<NFTListing>;
  buyNFT: (nftAddress: string, tokenId: number, price: string) => Promise<void>;
  cancelListing: (nftAddress: string, tokenId: number) => Promise<void>;
  updateListing: (nftAddress: string, tokenId: number, newPrice: string) => Promise<void>;
  withdrawProceeds: () => Promise<void>;
  getProceeds: (seller: string) => Promise<string>;
  isLoading: boolean;
  switchNetwork: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) throw new Error('Please install MetaMask');

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== REQUIRED_NETWORK.chainId) {
      await switchNetwork();
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: REQUIRED_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [REQUIRED_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch network');
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await checkAndSwitchNetwork();

        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const account = await signer.getAddress();
        setAccount(account);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask');
    }
  };

  const mintNFT = async (tokenURI: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFTabi,
        signer
      );

      const tx = await nftContract.mint(tokenURI);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      
      if (!event) {
        throw new Error("Transfer event not found in transaction receipt");
      }

      const tokenId = event.topics[3];
      const tokenIdNumber = parseInt(tokenId, 16);

      console.log(`NFT minted with tokenId: ${tokenIdNumber}`);

      return {
        tokenId: tokenIdNumber,
        nftAddress: NFT_CONTRACT_ADDRESS
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const listNFT = async (nftAddress: string, tokenId: number, price: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      
      const nftContract = new ethers.Contract(nftAddress, NFTabi, signer);
      console.log(`Approving NFT ${tokenId} for marketplace...`);
      const approveTx = await nftContract.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId);
      await approveTx.wait();
      console.log(`NFT ${tokenId} approved for marketplace`);

      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, signer);
      const priceInWei = ethers.parseEther(price);
      console.log(`Listing NFT ${tokenId} for ${price} ETH...`);
      const tx = await marketplaceContract.listNFT(nftAddress, tokenId, priceInWei);
      await tx.wait();
      console.log(`NFT ${tokenId} listed successfully`);
    } catch (error) {
      console.error('Error listing NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const buyNFT = async (nftAddress: string, tokenId: number, price: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, signer);
      const priceInWei = ethers.parseEther(price);
      console.log(`Buying NFT ${tokenId} for ${price} ETH...`);
      const tx = await marketplaceContract.buyNFT(nftAddress, tokenId, { value: priceInWei });
      await tx.wait();
      console.log(`NFT ${tokenId} bought successfully`);
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelListing = async (nftAddress: string, tokenId: number) => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, signer);
      console.log(`Cancelling listing for NFT ${tokenId}...`);
      const tx = await marketplaceContract.cancelListing(nftAddress, tokenId);
      await tx.wait();
      console.log(`Listing for NFT ${tokenId} cancelled successfully`);
    } catch (error) {
      console.error('Error cancelling listing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateListing = async (nftAddress: string, tokenId: number, newPrice: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, signer);
      const priceInWei = ethers.parseEther(newPrice);
      console.log(`Updating listing for NFT ${tokenId} to ${newPrice} ETH...`);
      const tx = await marketplaceContract.updateListing(nftAddress, tokenId, priceInWei);
      await tx.wait();
      console.log(`Listing for NFT ${tokenId} updated successfully`);
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawProceeds = async () => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, signer);
      console.log('Withdrawing proceeds...');
      const tx = await marketplaceContract.withdrawProceeds();
      await tx.wait();
      console.log('Proceeds withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing proceeds:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllListings = async (): Promise<NFTListing[]> => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      
      

      let newProvider = new ethers.BrowserProvider(window.ethereum);
      let signer = await newProvider.getSigner();

      // console.log(await signer.getAddress())
      console.log("NFT CONTRACT ADDRESS: ", NFT_CONTRACT_ADDRESS)
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTabi, signer);

      // console.log(await nftContract.tokenURI(1));

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceAbi,
        signer
      );

      const listings = await marketplaceContract.getAllListings();
      console.log('Raw listings:', listings);

     
      const formattedListings: NFTListing[] = await Promise.all(listings.map(async (listing: any) => {
        let tokenURI = null;
        try {
          let newProvider = new ethers.BrowserProvider(window.ethereum);
          let signer = await newProvider.getSigner();
    
          const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTabi, signer);
          console.log(listing.tokenId)
          // tokenURI = await nftContract.tokenURI(1);
          // console.log(nftContract.ownerOf(1))
          console.log(`TokenURI for ${listing.tokenId}:`, tokenURI);
        } catch (error) {
          console.error(`Error fetching tokenURI for tokenId ${listing.tokenId}:`, error);
        }

        return {
          tokenId: listing.tokenId.toString(),
          price: ethers.formatEther(listing.price),
          seller: listing.seller,
          nftAddress: listing.nftAddress,
          tokenURI: tokenURI
        };
      }));

      console.log('All Listings:', formattedListings);

      return formattedListings;
    } catch (error) {
      console.error('Error fetching all listings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const getListingsByOwner = async (owner: string): Promise<NFTListing[]> => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceAbi,
        signer
      );

      const listings = await marketplaceContract.getListingsByOwner(owner);
      
      const formattedListings: NFTListing[] = listings.map((listing: any) => ({
        tokenId: listing.tokenId.toString(),
        price: ethers.formatEther(listing.price),
        seller: listing.seller,
        nftAddress: listing.nftAddress
      }));

      console.log('Listings by owner:', formattedListings);

      return formattedListings;
    } catch (error) {
      console.error('Error fetching listings by owner:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getListing = async (nftAddress: string, tokenId: number): Promise<NFTListing> => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceAbi,
        signer
      );

      const listing = await marketplaceContract.getListing(nftAddress, tokenId);
      
      const formattedListing: NFTListing = {
        tokenId: listing.tokenId.toString(),
        price: ethers.formatEther(listing.price),
        seller: listing.seller,
        nftAddress: listing.nftAddress
      };

      console.log('Listing:', formattedListing);

      return formattedListing;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProceeds = async (seller: string): Promise<string> => {
    if (!account) {
      throw new Error('Please connect your wallet first.');
    }

    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceAbi,
        signer
      );

      const proceeds = await marketplaceContract.getProceeds(seller);
      const formattedProceeds = ethers.formatEther(proceeds);

      console.log('Proceeds:', formattedProceeds);

      return formattedProceeds;
    } catch (error) {
      console.error('Error fetching proceeds:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketplaceContext.Provider value={{ 
      account, 
      connectWallet, 
      listNFT,
      mintNFT,
      buyNFT,
      cancelListing,
      updateListing,
      withdrawProceeds,
      getAllListings,
      getListingsByOwner,
      getListing,
      getProceeds,
      isLoading,
      switchNetwork 
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplaceContext = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
};

