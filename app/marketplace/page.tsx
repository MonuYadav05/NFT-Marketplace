"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import Image from "next/image";
import { Search } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import axios from "axios";
import { toast } from "sonner";


const mockNFTs = [
    {
        id: 1,
        name: "Cosmic Creature #1",
        description: "A mystical being from the cosmos",
        image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c",
        price: "0.5",
        creator: "0x1234...5678",
        likes: 123,
    },
    {
        id: 2,
        name: "Digital Dreams #42",
        description: "Surreal digital artwork",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        price: "0.8",
        creator: "0x8765...4321",
        likes: 89,
    },
    {
        id: 3,
        name: "Pixel Punk #007",
        description: "Retro-inspired pixel art",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
        price: "0.3",
        creator: "0x9876...1234",
        likes: 245,
    },
];

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [priceRange, setPriceRange] = useState("all");
    const { getAllNfts } = useContract()
    const [NFTS, setNFTS] = useState<any>([]);

    const fetchMetadata = async () => {
        try {
            const allNfts = await getAllNfts();
            console.log(allNfts);
            if (!allNfts || !Array.isArray(allNfts)) {
                toast.error("Error fetching NFTs");
                return [];
            };
            const updatedAllNfts = await Promise.all(
                allNfts.map(async (nft: any) => {
                    const metadata = await axios.get(nft.tokenURI);
                    console.log("metadata", metadata);
                    return { ...nft, metadata: metadata.data };
                })
            )
            return updatedAllNfts;
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        (async () => {
            const allNfts = await fetchMetadata();
            console.log(allNfts)
            setNFTS(allNfts);
        })();

    }, [])

    const filteredNFTs = mockNFTs.filter((nft) =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(sortBy, priceRange, searchTerm);
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
                {filteredNFTs.map((nft) => (
                    <Card key={nft.id} className="overflow-hidden group">
                        <div className="aspect-square relative">
                            <Image
                                src={nft.image}
                                alt={nft.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {nft.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-bold">{nft.price} ETH</p>
                                </div>
                                <Button>
                                    Buy Now
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