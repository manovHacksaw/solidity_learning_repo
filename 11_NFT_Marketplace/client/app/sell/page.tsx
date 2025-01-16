'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus } from 'lucide-react'
import { useMarketplaceContext } from "@/context/MarketplaceProvider"
import { uploadToIPFS, uploadMetadataToIPFS } from "@/lib/ipfs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ListNFT() {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  
  const { account, connectWallet, mintNFT, listNFT, isLoading, switchNetwork } = useMarketplaceContext()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account) {
      try {
        await connectWallet()
      } catch (error: any) {
        if (error.message?.includes('network')) {
          toast({
            title: "Network Error",
            description: "Please switch to the Polygon ZkEVM Cardona Test network",
            variant: "destructive"
          })
          await switchNetwork()
        } else {
          toast({
            title: "Error",
            description: "Please install MetaMask and connect your wallet",
            variant: "destructive"
          })
        }
        return
      }
    }

    if (!file || !formData.name || !formData.description || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUploading(true)

      // 1. Upload image to IPFS
      setUploadProgress('Uploading image to IPFS...')
      const imageUrl = await uploadToIPFS(file)
      console.log('Image uploaded to IPFS:', imageUrl)

      // 2. Create and upload metadata
      setUploadProgress('Uploading metadata to IPFS...')
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        attributes: []
      }
      const tokenURI = await uploadMetadataToIPFS(metadata)
      console.log('Metadata uploaded to IPFS:', tokenURI)

      try {
        // 3. Mint NFT
        setUploadProgress('Minting NFT...')
        const { tokenId, nftAddress } = await mintNFT(tokenURI)
        console.log('NFT minted:', { tokenId, nftAddress })

        // 4. List NFT
        setUploadProgress('Listing NFT on marketplace...')
        await listNFT(nftAddress, tokenId, formData.price)
        console.log('NFT listed on marketplace')

        toast({
          title: "Success",
          description: "NFT has been minted and listed successfully!",
        })

        // Reset form
        setPreview(null)
        setFile(null)
        setFormData({
          name: '',
          description: '',
          price: ''
        })
      } catch (error: any) {
        console.error('Error during minting or listing:', error)
        if (error.message?.includes('network')) {
          toast({
            title: "Network Error",
            description: "Please switch to the Sepolia network",
            variant: "destructive"
          })
          await switchNetwork()
          return
        }
        throw error
      }

    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to mint and list NFT. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>List Your NFT</CardTitle>
        </CardHeader>
        <CardContent>
          {!account && (
            <Alert className="mb-6">
              <AlertDescription>
                Please connect your wallet to mint and list NFTs
              </AlertDescription>
            </Alert>
          )}
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="image">NFT Image</Label>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[300px] object-contain"
                  />
                ) : (
                  <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed rounded-lg">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setPreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">NFT Name</Label>
              <Input 
                id="name" 
                placeholder="Enter NFT name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your NFT"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: e.target.value
                }))}
              />
            </div>
            {uploadProgress && (
              <div className="text-sm text-muted-foreground">
                {uploadProgress}
              </div>
            )}
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading || isUploading}
            >
              {!account 
                ? 'Connect Wallet' 
                : isLoading || isUploading 
                  ? 'Processing...' 
                  : 'Create & List NFT'
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

