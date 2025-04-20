"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Parse from "../../../lib/parse";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    businessName: "",
  });

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      const userType = currentUser.get("userType");
      if (userType === "buyer") {
        currentUser.set("userType", "seller");
        currentUser.save();
      }
      setFormData((prev) => ({
        ...prev,
        userName: currentUser.get("username") || "",
        email: currentUser.get("email") || "",
      }));
    } else {
      router.push("/auth/login");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const currentUser = Parse.User.current();
    try {
      const Seller = Parse.Object.extend("Seller");
      const seller = new Seller();
      seller.set("userId", currentUser);
      seller.set("storeName", formData.businessName);
      seller.set("bio", formData.bio);
      seller.set("phoneNumber", Number(formData.phone));

      const newSeller = await seller.save();
      console.log("Seller created:", newSeller.id);
      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Error creating Seller:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Become a Seller</h1>
        <p className="text-muted-foreground mt-2">
          Start selling your products on our platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Please provide your account details to register as a seller
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business LLC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself and your business"
                className="min-h-32"
                required
              />
              <p className="text-sm text-muted-foreground">
                This bio will be visible to customers on your seller profile.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/seller/terms"
                    className="text-primary hover:underline"
                  >
                    Seller Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="policies" required />
                <label
                  htmlFor="policies"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand and agree to comply with all marketplace policies
                  and guidelines
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="accurate" required />
                <label
                  htmlFor="accurate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I certify that all information provided is accurate and
                  complete
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
