"use client"

import { useState, useEffect } from "react"
import Parse from "@/lib/parse"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Heart } from "lucide-react"

export default function ProductsPage() {
  // This would be fetched from an API in a real application
  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  }

  const [products, setProducts] = useState<Product[]>([]);

  async function getAllProducts() {
    try {
      const response = await Parse.Cloud.run("fetchAllProducts");
      console.log("Products fetched:", response);
      return response; 
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  useEffect(() => {
    getAllProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  async function handleAddToCart(productId: string, quantity: number = 1) {
    try {
      const response = await Parse.Cloud.run("addToCart", {
        productId,
        quantity,
      });
      console.log("Add to cart success:", response);
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
    }
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Search</h3>
            <div className="relative">
              <Input type="search" placeholder="Search products..." className="w-full" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Price Range</h3>
            <Slider defaultValue={[0, 100]} max={100} step={1} className="mb-6" />
            <div className="flex items-center justify-between">
              <span className="text-sm">$0</span>
              <span className="text-sm">$1000</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Sort By</h3>
            <Select defaultValue="featured">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Products</h1>
            <div className="text-sm text-muted-foreground">Showing {products.length} products</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 rounded-full hover:bg-white"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex gap-2">
                  <Button className="w-full" size="sm" onClick={() => handleAddToCart(product.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
