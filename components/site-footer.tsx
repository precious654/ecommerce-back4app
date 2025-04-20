import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Shop</h3>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
              All Products
            </Link>
            <Link href="/deals" className="text-sm text-muted-foreground hover:text-foreground">
              Deals & Offers
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Account</h3>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
              My Account
            </Link>
            <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">
              Orders
            </Link>
            <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-foreground">
              Wishlist
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Sellers</h3>
            <Link href="/seller/register" className="text-sm text-muted-foreground hover:text-foreground">
              Become a Seller
            </Link>
            <Link href="/seller/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Seller Terms
            </Link>
            <Link href="/seller/help" className="text-sm text-muted-foreground hover:text-foreground">
              Seller Help
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} E-Commerce, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Facebook
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
