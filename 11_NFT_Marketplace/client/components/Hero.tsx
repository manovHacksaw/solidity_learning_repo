import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Heading */}
      <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-800">
        Find The Perfect Digital Collectibles
      </h1>
      
      {/* Description */}
      <p className="text-gray-600 text-lg mb-8 max-w-2xl">
        Discover, collect, and sell extraordinary NFTs on the world's first & largest NFT marketplace.
      </p>
      
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg">
          Explore
        </Button>
        <Button variant="solid" className="bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-lg">
          Create
        </Button>
        <Link href={"/sell"}>
        <Button variant="solid" className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-3 rounded-lg">
          Sell
        </Button></Link>
        
      </div>
      
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <Input
          type="search"
          placeholder="Search items, collections, and accounts"
          className="pl-12 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          aria-label="Search items, collections, and accounts"
        />
        <Search className="absolute left-4 top-1.5 h-6 w-6 text-gray-400" />
      </div>
    </div>
  );
}
