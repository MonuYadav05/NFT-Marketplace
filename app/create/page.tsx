"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { usePinata } from "@/hooks/usePinata";

export default function Create() {
    const [isUploading, setIsUploading] = useState(false);
    const [nftData, setNftData] = useState<any>({
        name: "",
        description: "",
        price: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const { uploadFileToIpfs, uploadJsonToIpfs } = usePinata();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNftData((prev: any) => ({ ...prev, [name]: value }));
    };

    // useEffect(() => {
    //     const data = {
    //         name: "nft1",
    //         description: "nftData.description",
    //         price: "0.03",
    //     };
    //     uploadJsonToIpfs(JSON.stringify(data));
    // }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
        await uploadFileToIpfs(file);
        setPreview(URL.createObjectURL(file));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select an image file",);
            return;
        }
        try {
            setIsUploading(true);
            //upload image ot ipfs pinata
            const imageUrl = await uploadFileToIpfs(file);
            if (!imageUrl || !imageUrl.success) return;

            console.log(imageUrl);
            const nftMetadata = {
                name: nftData.name,
                description: nftData.description,
                image: imageUrl.pinataURL,
                price: nftData.price,
            }

            try {
                const metadataUrl = await uploadJsonToIpfs(JSON.stringify(nftMetadata));
                if (!metadataUrl || !metadataUrl.success) return;
                console.log(metadataUrl);
            } catch (err) {
                console.log(err);
                toast.error("Error uploading metadata to IPFS");
                return;
            }

            // call fucntion in contract to create token
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
                                    Uploading to IPFS... Dont GO Anywhere
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
                        <div className="mt-4 space-y-2">
                            <p className="font-semibold">{nftData.name || "Untitled NFT"}</p>
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