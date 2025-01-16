const PINATA_API_URL = 'https://api.pinata.cloud';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Try JWT first, fall back to API key/secret
    const headers: Record<string, string> = {};
    
    if (process.env.NEXT_PUBLIC_PINATA_JWT) {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;
    } else {
      headers['pinata_api_key'] = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
      headers['pinata_secret_api_key'] = process.env.NEXT_PUBLIC_PINATA_API_SECRET!;
    }

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }

    const data = await response.json() as PinataResponse;
    console.log(data)
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (process.env.NEXT_PUBLIC_PINATA_JWT) {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;
    } else {
      headers['pinata_api_key'] = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
      headers['pinata_secret_api_key'] = process.env.NEXT_PUBLIC_PINATA_API_SECRET!;
    }

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        pinataContent: metadata,
        pinataOptions: {
          cidVersion: 1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to upload metadata to IPFS: ${response.statusText}`);
    }

    const data = await response.json() as PinataResponse;
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

// Helper function to convert IPFS URL to HTTP URL for preview
export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  // Remove ipfs:// prefix if present
  const hash = ipfsUrl.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}
