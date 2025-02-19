"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, Search } from "lucide-react"
import { toast } from "sonner"

interface GalleryItem {
  id: string
  image: string
  title: string
  category: string
  likes: number
  hasLiked: boolean
  hasLikedByUser: boolean
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [user, setUser] = useState<any>(null)

  const initialGalleryItems = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&auto=format&fit=crop&q=60",
      title: "Traditional Japanese",
      category: "flash",
      likes: 124,
      hasLikedByUser: false
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1560707854-fe4cbd9eb4fb?w=800&auto=format&fit=crop&q=60",
      title: "Modern Minimalist",
      category: "minimal",
      likes: 89,
      hasLikedByUser: false
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?w=800&auto=format&fit=crop&q=60",
      title: "Custom Design",
      category: "custom",
      likes: 256,
      hasLikedByUser: false
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1612459284970-e8f027596582?w=800&auto=format&fit=crop&q=60",
      title: "Watercolor Style",
      category: "watercolor",
      likes: 167,
      hasLikedByUser: false
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1590246814883-55516d8c2a1e?w=800&auto=format&fit=crop&q=60",
      title: "Geometric Pattern",
      category: "minimal",
      likes: 145,
      hasLikedByUser: false
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&auto=format&fit=crop&q=60",
      title: "Traditional Rose",
      category: "flash",
      likes: 198,
      hasLikedByUser: false
    }
  ]

  useEffect(() => {
    setGalleryItems(initialGalleryItems)
  }, [])

  const categories = [
    { value: "all", label: "All Works" },
    { value: "flash", label: "Flash Tattoos" },
    { value: "minimal", label: "Minimal" },
    { value: "custom", label: "Custom" },
    { value: "watercolor", label: "Watercolor" }
  ]

  const handleLike = async (itemId: string) => {
    // if (!user) {
    //   toast.error("Please log in to like images")
    //   return
    // }

    const item = galleryItems.find(i => i.id === itemId)
    if (!item) return

    // try {
    //   if (item.hasLiked) {
    //     await supabase
    //       .from('gallery_likes')
    //       .delete()
    //       .match({ user_id: user.id, gallery_id: itemId })

    //     setGalleryItems(galleryItems.map(item => 
    //       item.id === itemId 
    //         ? { ...item, likes: item.likes - 1, hasLiked: false }
    //         : item
    //     ))
    //   } else {
    //     await supabase
    //       .from('gallery_likes')
    //       .insert({ user_id: user.id, gallery_id: itemId })

    //     setGalleryItems(galleryItems.map(item => 
    //       item.id === itemId 
    //         ? { ...item, likes: item.likes + 1, hasLiked: true }
    //         : item
    //     ))
    //   }
    // } catch (error) {
    //   toast.error("Error updating like")
    // }
    setGalleryItems(galleryItems.map(item =>
      item.id === itemId
        ? { ...item, likes: item.likes + (item.hasLikedByUser ? -1 : 1), hasLikedByUser: !item.hasLikedByUser }
        : item
    ))
  }

  const filteredItems = galleryItems.filter(item => {
    const matchesTab = activeTab === "all" || item.category === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleShare = () => {
    toast.success("Share functionality coming soon!")
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our collection of unique tattoo designs and completed works
        </p>
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search designs..."
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
                <CardFooter className="p-4 space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(item.id)}
                      className={item.hasLikedByUser ? "text-red-500" : ""}
                    >
                      <Heart className={`h-5 w-5 fill-current`} size={20} />
                      <span className="ml-2">{item.likes}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
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
