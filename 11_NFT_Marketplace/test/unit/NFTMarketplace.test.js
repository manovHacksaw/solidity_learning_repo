const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFT;
  let nft;
  let NFTMarketplace;
  let marketplace;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    nft = await NFT.deploy();
    await nft.waitForDeployment();

    marketplace = await NFTMarketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("NFT", function () {
    it("Should mint a new token", async function () {
      await nft.mint("example.com/1");
      expect(await nft.tokenCount()).to.equal(1n);
      expect(await nft.ownerOf(1)).to.equal(owner.address);
    });
  });

  describe("NFTMarketplace", function () {
    beforeEach(async function () {
      await nft.mint("example.com/1");
      await nft.approve(await marketplace.getAddress(), 1);
    });

    it("Should list an NFT", async function () {
      const marketplaceAddress = await marketplace.getAddress();
      const nftAddress = await nft.getAddress();
      
      await expect(marketplace.listNFT(nftAddress, 1, ethers.parseEther("1")))
        .to.emit(marketplace, "ItemListed")
        .withArgs(owner.address, nftAddress, 1n, ethers.parseEther("1"));

        console.log(await nft.tokenURI(1));

      const listing = await marketplace.getListing(nftAddress, 1);
      expect(listing.price).to.equal(ethers.parseEther("1"));
      expect(listing.seller).to.equal(owner.address);
    });

    it("Should not list an NFT if not owner", async function () {
      const nftAddress = await nft.getAddress();
      await expect(
        marketplace.connect(addr1).listNFT(nftAddress, 1, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(marketplace, "NFTMarketplace__NotTheOwner");
    });

    it("Should buy an NFT", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await expect(
        marketplace.connect(addr1).buyNFT(nftAddress, 1, { value: ethers.parseEther("1") })
      )
        .to.emit(marketplace, "ItemBought")
        .withArgs(addr1.address, nftAddress, 1n, ethers.parseEther("1"));

      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should not buy an NFT if price is not met", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await expect(
        marketplace.connect(addr1).buyNFT(nftAddress, 1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWithCustomError(marketplace, "NFTMarketplace__PriceNotMet");
    });

    it("Should cancel a listing", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await expect(marketplace.cancelListing(nftAddress, 1))
        .to.emit(marketplace, "ItemCancelled")
        .withArgs(owner.address, nftAddress, 1n);

      await expect(
        marketplace.getListing(nftAddress, 1)
      ).to.be.revertedWithCustomError(marketplace, "NFTMarketplace__NotListed");
    });

    it("Should update a listing", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await expect(marketplace.updateListing(nftAddress, 1, ethers.parseEther("2")))
        .to.emit(marketplace, "ItemListed")
        .withArgs(owner.address, nftAddress, 1n, ethers.parseEther("2"));

      const listing = await marketplace.getListing(nftAddress, 1);
      expect(listing.price).to.equal(ethers.parseEther("2"));
    });

    it("Should withdraw proceeds", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await marketplace.connect(addr1).buyNFT(nftAddress, 1, { value: ethers.parseEther("1") });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await marketplace.withdrawProceeds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance - initialBalance + gasUsed).to.be.closeTo(
        ethers.parseEther("1"),
        ethers.parseEther("0.01") // Account for gas costs
      );
    });

    it("Should get all listings", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await nft.mint("example.com/2");
      await nft.approve(await marketplace.getAddress(), 2);
      await marketplace.listNFT(nftAddress, 2, ethers.parseEther("2"));

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(2);
      expect(listings[0].price).to.equal(ethers.parseEther("1"));
      expect(listings[1].price).to.equal(ethers.parseEther("2"));
    });

    it("Should get listings by owner", async function () {
      const nftAddress = await nft.getAddress();
      await marketplace.listNFT(nftAddress, 1, ethers.parseEther("1"));
      await nft.mint("https://example.com/2");
      await nft.approve(await marketplace.getAddress(), 2);
      await marketplace.listNFT(nftAddress, 2, ethers.parseEther("2"));

      const listings = await marketplace.getListingsByOwner(owner.address);
      expect(listings.length).to.equal(2);
      expect(listings[0].price).to.equal(ethers.parseEther("1"));
      expect(listings[1].price).to.equal(ethers.parseEther("2"));
    });
  });
});

