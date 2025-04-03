"use client"

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia, } from 'wagmi/chains';
import { QueryClientProvider, QueryClient, } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React from 'react';
import { Toaster } from "@/components/ui/sonner";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const rainbowConfig = getDefaultConfig({
    appName: "NFT Marketplace",
    projectId: `${projectId}`,
    chains: [sepolia],
    ssr: true,
});


export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = React.useState(false);

    const queryClient = new QueryClient();


    React.useEffect(() => {
        setMounted(true);
    }, []);

    return <WagmiProvider config={rainbowConfig}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                />
                {mounted && children}
                <Toaster />
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
};