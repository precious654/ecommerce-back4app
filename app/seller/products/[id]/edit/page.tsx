"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Parse from "@/lib/parse"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    stock: "",
    images: ["", "", ""],
    status: "active",
  })


  // Fetch product data (in a real app, this would be an API call)
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        // Call your Cloud Code function to retrieve a single product
        const response = await Parse.Cloud.run("getSingleProduct", {
          productId: params.id,
        });

        // Map the response to our component's local state
        setProduct({
          id: response.objectId,
          name: response.name || "",
          price: String(response.price ?? "0"),
          description: response.description || "",
          stock: String(response.quantityAvailable ?? "0"),
          // Fallback to placeholders if actual image data is not provided
          images: [
            response.image1 || `/placeholder.svg?height=500&width=500&text=Product`,
            response.image2 || `/placeholder.svg?height=500&width=500&text=ProductView+2`,
            response.image3 || `/placeholder.svg?height=500&width=500&text=ProductView+3`,
          ],
          status: response.isActive ? "active" : "out_of_stock",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setIsLoading(false);
    }

    fetchProduct();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert the local state into parameters for updateProduct
      await Parse.Cloud.run("updateProduct", {
        productId: product.id,
        name: product.name,
        description: product.description,
        // Convert strings to proper numeric types
        price: parseFloat(product.price),
        quantityAvailable: parseInt(product.stock, 10),
        // Map our "active / draft / out_of_stock" to a boolean or other logic
        isActive: product.status === "active",
        // Optionally pass a category if your Cloud Code handles it
        // category: product.category,
      });

      // Redirect after successful update
      router.push("/seller/dashboard?tab=products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await Parse.Cloud.run("deleteProduct", {
        productId: product.id,
      });
      // Navigate back to the product list
      router.push("/seller/dashboard?tab=products");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/seller/dashboard?tab=products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update your product information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-center">
                  <p>Loading product data...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price ($)</Label>
                    <Input
                      id="product-price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                      type="number"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-status">Status</Label>
                  <Select value={product.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="product-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="border rounded-lg p-2 relative">
                        <img
                          src={image || "/placeholder.svg?height=200&width=200"}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="flex justify-center mt-2">
                          <Button type="button" variant="outline" size="sm">
                            Change Image
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/seller/dashboard?tab=products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
