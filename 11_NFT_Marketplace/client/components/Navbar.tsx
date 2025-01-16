'use client'

import { useContext, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { useMarketplaceContext } from "@/context/MarketplaceProvider";

export function Navbar() {
  // 
  const {account: walletAddress, connectWallet} = useMarketplaceContext();
  

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            NFTverse.
          </Link>
          <div className="hidden md:block ml-10">
            <div className="flex items-center space-x-8">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Create
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Collections
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Community
              </Link>
            </div>
          </div>
        </div>
        {/* Connect Wallet Button */}
        {walletAddress ? (
          <span className="text-gray-600 bg-gray-100 py-2 px-4 rounded-lg">
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
          </span>
        ) : (
          <Button
            onClick={connectWallet}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
}
