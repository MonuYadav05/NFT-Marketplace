import {getAccount}  from "@wagmi/core";
import { rainbowConfig } from "@/app/Providers";
import {readContract} from "@wagmi/core";
import { contractAddress , abi } from "@/app/NFTMarketplace.json";

export const useContract = () => {
    const {address , isConnected} = getAccount(rainbowConfig);

    const getAllNfts = () => {
        if(!contractAddress) return;

        const nfts = readContract(rainbowConfig ,{
            address: contractAddress as `0x${string}`,
            abi:abi,
            functionName:"getAllNFTs",
        })

        return nfts;
    } 

    return {address , isConnected , getAllNfts }
}