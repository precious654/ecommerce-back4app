"use client";

import React from "react";
import Link from "next/link";
import Parse from "@/lib/parse";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User } from "lucide-react";

export function SiteHeader() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // This would be replaced with actual auth state
  const [isSeller, setIsSeller] = useState(false); // This would be replaced with actual user role check

  React.useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      setIsLoggedIn(true);
      const userType = currentUser.get("userType"); // Fetch the 'userType' column from Parse
      setIsSeller(userType === "seller");
    } else {
      setIsLoggedIn(false);
      setIsSeller(false);
    }
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      setIsLoggedIn(false);
      setIsSeller(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">E-COMMERCE</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/products" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Products
            </Link>
            {isSeller && (
              <Link
                href="/seller/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/seller")
                    ? "text-primary"
                    : "text-foreground/60"
                }`}
              >
                Seller Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  {isSeller ? (
                    <DropdownMenuItem asChild>
                      <Link href="/seller/dashboard">Seller Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/seller/register">Become a Seller</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    Products
                  </Link>
                  {isSeller && (
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setIsOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  {!isLoggedIn && (
                    <>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
