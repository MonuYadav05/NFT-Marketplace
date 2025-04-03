import Hero from "@/components/homepage/Hero";
import { Card } from "@/components/ui/card";
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCollections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{collection.name}</h3>
                  <p className="text-muted-foreground">{collection.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Floor: {collection.floorPrice} ETH
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Volume: {collection.volume} ETH
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const featuredCollections = [
  {
    id: 1,
    name: "Cosmic Creatures",
    description: "A collection of mystical beings from across the universe",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c",
    floorPrice: "0.5",
    volume: "120",
  },
  {
    id: 2,
    name: "Digital Dreams",
    description: "Surreal artwork crafted in the digital realm",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    floorPrice: "0.8",
    volume: "200",
  },
  {
    id: 3,
    name: "Pixel Punks",
    description: "Retro-inspired pixel art for the modern collector",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    floorPrice: "0.3",
    volume: "80",
  },
];
