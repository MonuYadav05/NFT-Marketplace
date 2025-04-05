"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import axios from "axios";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [priceRange, setPriceRange] = useState("all");
    const { getAllNfts, address, buyNFT } = useContract()
    const [NFTS, setNFTS] = useState<any>(null);
    const [filteredNFTs, setFilteredNFTs] = useState<any>([]);
    const [buyingNFT, setBuyingNFT] = useState(null);
    const router = useRouter();
    const nftCacheRef = useRef<any>(null);

    const fetchMetadata = async () => {
        try {
            const allNfts = await getAllNfts();
            // console.log(allNfts);
            if (!allNfts || !Array.isArray(allNfts)) {
                toast.error("Error fetching NFTs");
                return [];
            };
            const updatedAllNfts = await Promise.all(
                allNfts.map(async (nft: any) => {
                    const response = await axios.get(nft.tokenURI);
                    const firstKey = Object.keys(response.data)[0]; // Get the incorrect key
                    const metadata = JSON.parse(firstKey); // Parse it into a proper object

                    // console.log("Parsed Metadata:", metadata);
                    return { ...nft, metadata: metadata };
                })
            )
            return updatedAllNfts;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    useEffect(() => {
        if (nftCacheRef.current) {
            console.log(nftCacheRef.current);
            setNFTS(nftCacheRef.current);
            return;
        }
        (async () => {
            const allNfts = await fetchMetadata();
            nftCacheRef.current = allNfts;
            setNFTS(allNfts);
        })();

    }, [])


    useEffect(() => {
        if (NFTS) {
            const filteredNFTs = NFTS.filter((nft: any) => {
                return nft.metadata && nft.metadata.name && nft?.metadata?.name.toLowerCase().includes(searchTerm.toLowerCase())
            }
            );
            setFilteredNFTs(filteredNFTs);
        }
    }, [NFTS, searchTerm]);

    const handleBuyNft = async (nft: any) => {
        setBuyingNFT(nft.tokenId);
        try {
            const response = await buyNFT(nft.tokenId, nft.price);
            const stringfy = (JSON.stringify(response));
            console.log(stringfy);
            // @ts-ignore
            if (response && response?.success) {
                setBuyingNFT(null);
                router.push("/profile");
            }
            else {
                // @ts-ignore
                // toast.error(response?.error);
                console.log("error in buying nft");
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setBuyingNFT(null);
        }
    }

    if (!NFTS) return <div className="flex items-center justify-center gap-3 min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <span className="text-xl">Fetching NFTs from the Blockchain...</span>
    </div>

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold">Explore NFTs</h1>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search NFTs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="likes">Most Liked</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="under-1">Under 1 ETH</SelectItem>
                                <SelectItem value="1-5">1-5 ETH</SelectItem>
                                <SelectItem value="over-5">Over 5 ETH</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft: any) => (
                    <Card key={nft.id} className="overflow-hidden group">
                        <div className="aspect-square relative">
                            <Image
                                src={nft?.metadata?.image}
                                alt={nft?.metadata?.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <div className="p-4 pt-0">
                            <h3 className="font-bold text-lg mb-1">{nft?.metadata?.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {nft?.metadata?.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-bold">{ethers.formatEther(nft.price)} ETH</p>
                                </div>
                                <Button disabled={nft.owner == address || nft.seller == address} className="cursor-pointer" onClick={() => handleBuyNft(nft)}>
                                    {nft.owner == address || nft.seller == address ? "You own this NFT" : "Buy Now"}
                                    {buyingNFT && nft.tokenId == buyingNFT && <Loader2 className="h-4 w-4 animate-spin" />}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredNFTs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No NFTs found matching your search.</p>
                </div>
            )}
        </div>
    );
}