"use client";

import type React from "react";

import { useState } from "react";
import Parse from "@/lib/parse";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    status: "active",
  });

  const [images, setImages] = useState<File[]>([]);
  const [base64Images, setBase64Images] = useState<{ base64: string; fileName: string }[]>([]);
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);
      alert(`You have added an image to the ${images.length + 1} slot`);

      newImages.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Images((prev) => [
            ...prev,
            {
              base64: reader.result as string,
              fileName: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    };
  };

  console.log("images", images);
  console.log("base64Images", base64Images);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This would be replaced with actual create product logic
    try {
      interface AddProductParams {
        name: string;
        description: string;
        price: number;
        quantityAvailable: number;
        isActive: boolean;
      }

      interface AddProductResponse {
        id: string;
      }

      Parse.Cloud.run<AddProductResponse, AddProductParams>("addProduct", {
        name: product.name,
        description: product.description,
        price: product.price,
        quantityAvailable: product.stock,
        isActive: product.status === "active",
        imageFiles: base64Images,
      }).then((response) => {
        console.log("Product created:", response.id);
      });

      router.push("/seller/dashboard?tab=products");
      router.refresh();
    } catch (error) {
      console.error("Error creating product:", error);
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
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Create a new product listing</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
              <div className="space-y-2">
                <Label htmlFor="product-status">Status</Label>
                <Select
                  value={product.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="product-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label>Product Images</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center gap-1 py-4">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {index === 0
                          ? "Upload main image"
                          : `Upload additional image ${index}`}
                      </p>
                      <label htmlFor="image" className="border-2 border-dashed rounded-lg p-2 text-sm text-muted-foreground cursor-pointer hover:border-[#FFFFFF]">
                          Choose File
                      </label>
                      <input type="file" id="image" className="hidden" onChange={addImage}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/seller/dashboard?tab=products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
