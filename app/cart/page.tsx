"use client"

import { useState, useEffect } from "react"
import Parse from "@/lib/parse"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  // This would be fetched from an API or state management in a real application
  interface CartItem {
    id: string;       // Product's objectId
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await Parse.Cloud.run("getCart");
        const parsed = response.items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
        setCartItems(parsed);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    }
  
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Avoid zero or negative quantities here; remove item instead

    try {
      // Call the updateCart Cloud Code function
      await Parse.Cloud.run("updateCart", {
        productId,
        newQuantity,
      });

      // Optimistically update the local state
      setCartItems((items) =>
        items.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };
  

  const removeItem = async (productId: string) => {
    try {
      await Parse.Cloud.run("removeFromCart", {
        productId,
      });
      // Remove the item from local state
      setCartItems((items) => items.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  async function callCreateOrder() {
    try {
      const user = Parse.User.current();
      if (!user) {
        throw new Error("You must be logged in to place an order.");
      }
  
      const result = await Parse.Cloud.run("createOrder");
      setTimeout(() => {window.location.reload();}, 2000);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Something went wrong.",
      };
    }
  }

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    setStatus(null);

    const response = await callCreateOrder();

    if (response.success) {
      console.log("Order created successfully:", response.data); 
    } else {
      console.error("Error creating order:", response.error);
    }

    setLoading(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <span className="text-muted-foreground">{cartItems.length} items</span>
          </div>

          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex flex-1 flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: SKU-{item.id}00{item.id}
                      </p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-8">
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="w-full md:w-96">
            <div className="sticky top-20">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Discount Code</span>
                        <span className="text-muted-foreground">Apply</span>
                      </div>
                      <Input placeholder="Enter code" />
                    </div>

                    <Button className="w-full" onClick={handleOrder}>Proceed to Checkout</Button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
