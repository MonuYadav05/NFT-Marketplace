"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { usePinata } from "@/hooks/usePinata";
import { useContract } from "@/hooks/useContract";
import { connect } from '@wagmi/core'
import { redirect } from "next/navigation";

export default function Create() {
    const [isUploading, setIsUploading] = useState(false);
    const [nftData, setNftData] = useState<any>({
        name: "",
        description: "",
        price: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const { uploadFileToIpfs, uploadJsonToIpfs, } = usePinata();
    const { createNft, isConnected } = useContract();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNftData((prev: any) => ({ ...prev, [name]: value }));
    };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
        setPreview(URL.createObjectURL(file));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select an image file",);
            return;
        }
        connect
        if (!isConnected) {
            toast.error("Please connect your wallet first!",);
            return;
        }

        try {
            setIsUploading(true);
            //upload image ot ipfs pinata
            const imageUrl = await uploadFileToIpfs(file);
            if (!imageUrl || !imageUrl.success) return;

            const nftMetadata = {
                name: nftData.name,
                description: nftData.description,
                image: imageUrl.pinataURL,
                price: nftData.price,
            }

            const metadataUrl = await uploadJsonToIpfs(JSON.stringify(nftMetadata));
            if (!metadataUrl.pinataURL || !metadataUrl.success) {
                toast.error("Error uploading metadata to IPFS");
                return;
            };

            const response = await createNft(metadataUrl.pinataURL, nftData.price);
            if (!response || !response.success) {
                toast.error("Error creating NFT in page");
                return;
            }
            setNftData({ name: "", description: "", price: "" });
            setFile(null);
            setPreview("");
            redirect("/marketplace")
        } catch (err) {
            console.log("Error uploading file to IPFS", err);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-8">List Your NFT</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">NFT Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={nftData.name}
                                onChange={handleInputChange}
                                placeholder="Enter NFT name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={nftData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your NFT"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price (ETH)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.001"
                                value={nftData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price in ETH"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file">Upload Image</Label>
                            <Input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Createing NFT...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    List NFT
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Preview</h2>
                    <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                        {preview ? (
                            <Image
                                src={preview}
                                alt="NFT Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No image selected
                            </div>
                        )}
                    </div>

                    {preview && (
                        <div className="mt-2 space-y-2">
                            <p className="font-semibold text-lg">{nftData.name || "Untitled NFT"}</p>
                            <p className="text-sm text-gray-500">
                                {nftData.description || "No description"}
                            </p>
                            <p className="text-sm font-semibold">
                                {nftData.price ? `${nftData.price} ETH` : "Price not set"}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}