"use client"

import Parse from "@/lib/parse"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Truck, RotateCcw, Shield } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);

  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images?: [];
    quantityAvailable: number; // Added property
  }

  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    images: [],
    quantityAvailable: 0, // Added default value
  });
  
    async function getSingleProduct() {
      try {
        const response = await Parse.Cloud.run("getSingleProduct", {productId: params.id});
        console.log("Product fetched:", response);
        return response; 
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
  
    useEffect(() => {
      getSingleProduct()
        .then((product) => {
          setProduct(product);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }, []);

  // This would be fetched from an API in a real application

  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url() || "/placeholder.svg")

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img src={product.images?.[0]?.url() || "/placeholder.svg"} alt={product.name} className="w-full h-auto" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product?.images?.map((image, index) => (
              <button
                key={index}
                className={`border rounded-md overflow-hidden flex-shrink-0 ${
                  selectedImage === image ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image?.url() || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
              &larr; Back to Products
            </Link>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                  disabled={quantity >= product.quantityAvailable}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">{product.quantityAvailable} available</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Free Shipping</p>
                <p className="text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">30 Days Return</p>
                <p className="text-muted-foreground">Hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Secure Payment</p>
                <p className="text-muted-foreground">Protected by encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>High-quality materials</li>
                <li>Durable construction</li>
                <li>Modern design</li>
                <li>Easy to use</li>
                <li>Versatile functionality</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Dimensions</span>
                  <span>10 x 5 x 2 inches</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Weight</span>
                  <span>1.2 lbs</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Material</span>
                  <span>Aluminum</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Color</span>
                  <span>Silver</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Warranty</span>
                  <span>1 Year</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
