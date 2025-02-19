"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Search, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { MongoClient, ServerApiVersion } from 'mongodb';

interface FlashTattoo {
  id: string
  image: string
  title: string
  category: string
  price: number
  size: string
  likes: number
  hasLiked: boolean
}

const uri = process.env.MONGODB_URI || "mongodb://192.168.0.24:27017/jimmysbaliink";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export default function FlashPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [flashTattoos, setFlashTattoos] = useState<FlashTattoo[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchFlashTattoos = async () => {
      try {
        await client.connect();
        const db = client.db("jimmysbaliink_db");
        const collection = db.collection("flash_tattoos");

        const tattoos = await collection.find({}).toArray();
        setFlashTattoos(tattoos);
      } catch (error) {
        console.error("Error fetching flash tattoos:", error);
        toast.error("Failed to load flash tattoos.");
      } finally {
        await client.close();
      }
    };

    fetchFlashTattoos();
  }, []);

  const categories = [
    { value: "all", label: "All Flash" },
    { value: "floral", label: "Floral" },
    { value: "geometric", label: "Geometric" },
    { value: "asian", label: "Asian" },
    { value: "celestial", label: "Celestial" }
  ]

  const handleLike = async (itemId: string) => {
    try {
      await client.connect();
      const db = client.db("jimmysbaliink_db");
      const collection = db.collection("flash_tattoos");
  
      const item = flashTattoos.find(i => i.id === itemId);
      if (!item) return;
  
      const newLikes = item.hasLiked ? item.likes - 1 : item.likes + 1;
      const newHasLiked = !item.hasLiked;
  
      await collection.updateOne(
        { id: itemId },
        { $set: { likes: newLikes, hasLiked: newHasLiked } }
      );
  
      setFlashTattoos(flashTattoos.map(tattoo =>
        tattoo.id === itemId ? { ...tattoo, likes: newLikes, hasLiked: newHasLiked } : tattoo
      ));
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Error updating like");
    } finally {
      await client.close();
    }
  };

  const filteredItems = flashTattoos.filter(item => {
    const matchesTab = activeTab === "all" || item.category === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Flash Tattoos</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse our collection of ready-to-ink designs at fixed prices
        </p>
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search flash designs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="flex justify-center mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex-col space-y-4">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-md">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{item.price}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-muted-foreground">{item.size}</span>
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleLike(item.id)}
                        className={item.hasLiked ? "text-red-500" : ""}
                      >
                        <Heart className={`h-5 w-5 ${item.hasLiked ? "fill-current" : ""}`} />
                        <span className="ml-2">{item.likes}</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
