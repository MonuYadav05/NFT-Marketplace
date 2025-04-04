
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import Image from "next/image";
import { ethers } from "ethers";
import { useState } from "react";
import { Card } from "./ui/card";

export const NftCard = ({ NFTS }: any) => {
    const [activeTab, setActiveTab] = useState("collected");

    return <div className="md:col-span-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
                <TabsTrigger value="collected">Collected</TabsTrigger>
            </TabsList>

            <TabsContent value="collected">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {NFTS.map((nft: any) => (
                        <Card key={nft.id} className="overflow-hidden group">
                            <div className="aspect-square relative">
                                <Image
                                    src={nft?.metadata?.image}
                                    alt={nft?.metadata?.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div className="px-4 ">
                                <h3 className="font-bold text-lg mb-1">{nft?.metadata?.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {nft?.metadata?.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold">{ethers.formatEther(nft?.price)} ETH</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>


        </Tabs>
    </div>
}
