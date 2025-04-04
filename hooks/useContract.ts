import { useAccount } from 'wagmi'
import { writeContract, readContract } from '@wagmi/core'
import { rainbowConfig } from '@/app/Providers'
import { contractAddress, abi } from '@/app/NFTMarketplace.json'
import { parseEther } from 'viem'
import { sepolia } from 'viem/chains'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

export const useContract = () => {
  const { address, isConnected } = useAccount()

  const getAllNfts = async () => {
    if (!contractAddress) return
    const nfts = await readContract(rainbowConfig, {
      address: contractAddress as `0x${string}`,
      abi: abi,
      functionName: 'getAllNFTs'
    })
    if (!nfts || !Array.isArray(nfts)) {
      console.log('nfts is not array')
      return []
    }
    const updatedNfts = await Promise.all(
      nfts.map(async (nft: any) => {
        const tokenURI = await readContract(rainbowConfig, {
          abi,
          address: contractAddress as `0x${string}`,
          functionName: 'tokenURI',
          args: [nft.tokenId]
        })
        return { ...nft, tokenURI }
      })
    )
    return updatedNfts
  }

  const getListPrice = async () => {
    if (!contractAddress) return
    const listPriceRaw = await readContract(rainbowConfig, {
      abi,
      address: contractAddress as `0x${string}`,
      functionName: 'getListPrice'
    })
    if (!listPriceRaw) throw new Error('listPrice is undefined')

    const listPrice = BigInt(listPriceRaw.toString()) // Ensure it's bigint
    return listPrice
  }

  const createNft = async (tokenURI: string, price: number) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!')
      console.error('Wallet is not connected')
      return
    }

    if (!contractAddress) {
      toast.error('Contract address not found')
      console.error('Contract address is undefined')
      return
    }

    const listPrice = await getListPrice()

    if (!listPrice) {
      toast.error('Listing fee could not be retrieved')
      console.error('listPrice is invalid:', listPrice)
      return
    }

    try {
      console.log('Sending transaction with:', { tokenURI, price, listPrice })

      const result = await writeContract(rainbowConfig, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: 'createToken',
        args: [tokenURI, parseEther(price.toString())],
        value: listPrice, // Send listing fee
        chainId: sepolia.id
      })

      console.log('NFT Created:', result)
      toast.success('NFT created successfully! 🎉')
      return {
        success: true,
        result: result
      }
    } catch (error) {
      console.error('Error creating NFT in hook:', error)
      toast.error('Failed to create NFT. hook')
      return {
        success: false,
        error: error
      }
    }
  }

  const getMyNfts = async () => {
    if (!contractAddress || !address) {
      toast.error('Contract address or address not found')
      return
    }
    try {
      const nfts = await readContract(rainbowConfig, {
        address: contractAddress as `0x${string}`,
        abi: abi,
        functionName: 'getMyNFTs',
        account: address
      })
      if (!nfts || !Array.isArray(nfts)) {
        console.log('nfts is not array')
        return []
      }

      const updatedNfts = await Promise.all(
        nfts.map(async (nft: any) => {
          const tokenURI = await readContract(rainbowConfig, {
            abi,
            address: contractAddress as `0x${string}`,
            functionName: 'tokenURI',
            args: [nft.tokenId]
          })
          nft.tokenURI = tokenURI
          return { ...nft, tokenURI }
        })
      )
      return updatedNfts
    } catch (error) {
      console.log('error in getting my nfts', error)
    }
  }

  const updateListingPrice = async () => {
    if (!contractAddress || !address) {
      toast.error('Contract address or address not found')
      return
    }

    try {
      const response = await writeContract(rainbowConfig, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: 'updateListPrice',
        args: [parseEther('0.0001')]
      })
      console.log(response)
      console.log('updateListingPrice')
    } catch (error) {
      console.log('error in updating listing price', error)
    }
  }

  const buyNFT = async (userId: string, price: number) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!')
      console.error('Wallet is not connected')
      return
    }

    try {
      if (!price || isNaN(Number(price))) {
        console.error('Invalid price:', price)
        return toast.error('Invalid NFT price!')
      }

      const response = await writeContract(rainbowConfig, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: 'executeSale',
        args: [userId],
        value: BigInt(price)
      })
      toast.success('NFT bought successfully! 🎉')
      return {
        success: true,
        result: response
      }
    } catch (error) {
      toast.error('Failed to buy NFT Maybe you dont have enough balance')
      return {
        success: false,
        error: error
      }
    }
  }

  return {
    address,
    isConnected,
    getAllNfts,
    getListPrice,
    createNft,
    getMyNfts,
    updateListingPrice,
    buyNFT
  }
}
