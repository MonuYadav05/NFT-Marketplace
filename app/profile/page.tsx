"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, CircleUser, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useContract } from "@/hooks/useContract";
import axios from 'axios';
import { NftCard } from "@/components/NftCard";
import { ethers } from "ethers";

// Mock user data
const userData = {
    username: "CryptoCollector",
    bio: "Passionate NFT collector and digital art enthusiast",
    joinedDate: "Jan 2024",
    totalNFTs: 12,
    volumeTraded: "5.8 ETH",
};



export default function ProfilePage() {
    const { address, getMyNfts } = useContract();
    const [NFTS, setNFTS] = useState<any>(null);

    const fetchMetadata = async () => {
        try {
            const myNfts = await getMyNfts();
            // console.log(myNfts);
            if (!myNfts || !Array.isArray(myNfts)) {
                toast.error("Error fetching NFTs");
                return [];
            };
            const updatedmyNfts = await Promise.all(
                myNfts.map(async (nft: any) => {
                    const response = await axios.get(nft.tokenURI);
                    const firstKey = Object.keys(response.data)[0]; // Get the incorrect key
                    const metadata = JSON.parse(firstKey); // Parse it into a proper object

                    // console.log("Parsed Metadata:", metadata);
                    return { ...nft, metadata: metadata };
                })
            )
            return updatedmyNfts;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    useEffect(() => {
        if (address) {
            (async () => {
                const myNfts = await fetchMetadata();
                setNFTS(myNfts);
                console.log(myNfts)
            })();
        }

    }, [address])

    const shortAddress = address?.slice(0, 4) + "..." + address?.slice(-4);

    const copyAddress = () => {
        navigator.clipboard.writeText(address!);
        toast("Wallet address copied to clipboard",);
    };

    const totalprice = (NFTS: any) => {
        let total = BigInt(0);
        NFTS.forEach((nft: any) => {
            total += BigInt(nft.price);
        });
        return total;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Profile Sidebar */}
                <Card className="p-6 md:col-span-1 h-fit">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">

                            <CircleUser className="w-32 h-32" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{userData.username}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <code className="text-sm bg-secondary px-2 py-1 rounded">
                                {shortAddress}
                            </code>
                            <Button variant="ghost" size="icon" onClick={copyAddress}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-muted-foreground mb-4">{userData.bio}</p>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="text-center">
                                <p className="font-bold">{NFTS == null ? "..." : NFTS.length}</p>
                                <p className="text-sm text-muted-foreground">NFTs</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">{NFTS == null ? "..." : ethers.formatEther(totalprice(NFTS).toString())}</p>
                                <p className="text-sm text-muted-foreground">Total Price</p>
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <Button className="w-full" variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Main Content */}
                {NFTS == null ? <div className="flex items-center mb-52 ml-24 w-[200px] justify-center gap-3 min-h-screen">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <span className="text-xl">Fetching Your NFTs from the Blockchain...</span>
                </div> : <NftCard NFTS={NFTS} />

                }
            </div>
        </div>
    );
}

