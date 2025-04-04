import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const Hero = () => {
    return (
        <section className="py-20 px-4 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Create, Collect, and Trade Unique NFTs
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join the next generation of digital creators and collectors in the
                    world's most innovative NFT marketplace
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/marketplace">
                        <Button size="lg" variant="secondary">
                            Explore NFTs
                        </Button>
                    </Link>
                    <Link href="/create">
                        <Button size="lg">Start Creating</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Hero