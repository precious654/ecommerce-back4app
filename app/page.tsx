import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your One-Stop Shop for Everything
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Discover amazing products from sellers around the world. Shop with confidence and find exactly what
                    you need.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/products">
                    <Button size="lg" className="gap-1.5">
                      Shop Now
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/seller/register">
                    <Button size="lg" variant="outline" className="gap-1.5">
                      Become a Seller
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Check out our most popular items handpicked for you
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                  <div className="p-6 flex flex-col items-center">
                    <img
                      src={`/placeholder.svg?height=200&width=200&text=Product+${i}`}
                      width={200}
                      height={200}
                      alt={`Product ${i}`}
                      className="rounded-md object-cover mb-4"
                    />
                    <h3 className="text-lg font-bold">Product Name {i}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <div className="mt-4 flex items-center">
                      <span className="text-xl font-bold">${(19.99 * i).toFixed(2)}</span>
                    </div>
                    <Button className="mt-4 w-full">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/products">
                <Button variant="outline" size="lg">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Us</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We provide the best shopping experience for our customers
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                { title: "Fast Shipping", description: "Get your products delivered quickly and efficiently" },
                { title: "Secure Payments", description: "Shop with confidence with our secure payment options" },
                { title: "Quality Products", description: "All products are verified for quality and authenticity" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
