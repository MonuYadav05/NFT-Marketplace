"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Palette, ShoppingBag, Compass, Users } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useEffect } from "react";

export function Navbar() {
    const { address, isConnected } = useContract();

    useEffect(() => {
        if (isConnected) {
            console.log(address)
        }
    }, [isConnected, address])

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Palette className="h-6 w-6" />
                        <span className="font-bold text-xl">NFTverse</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6 ml-6">
                        <Link href="/explore" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                            <Compass className="h-4 w-4" />
                            <span>Explore</span>
                        </Link>
                        <Link href="/create" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                            <Palette className="h-4 w-4" />
                            <span>List NFT</span>
                        </Link>
                        <Link href="/marketplace" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Marketplace</span>
                        </Link>
                        <Link href="/community" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                            <Users className="h-4 w-4" />
                            <span>Community</span>
                        </Link>
                    </div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}