import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, QrCode } from "lucide-react"
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-zinc-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-64 -top-64 h-[600px] w-[600px] rounded-full bg-emerald-100/50 dark:bg-emerald-900/20" />
        <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-amber-100/50 dark:bg-amber-900/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:pt-32 lg:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Transform Your Restaurant Menu
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              With a Simple QR Code
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Create a beautiful, interactive digital menu in minutes. No apps needed - just scan and order. 
            Delight your customers and boost your sales with KhadyamQR.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="group text-lg px-8 py-6" asChild>
              <Link to="/register">
                Create Your Free Menu
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="#demo">
                {/* PlayCircle removed to avoid missing icon reference */}
                Watch Demo
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex items-center gap-x-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item}
                  className="h-10 w-10 rounded-full border-2 border-white bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
                >
                  <div className="h-full w-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
              ))}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">500+ Restaurants</p>
              <p>already digitized their menus</p>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mt-16 lg:mt-0">
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900/80 dark:ring-white/10">
              <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  menu.yourrestaurant.com
                </div>
              </div>
              <div className="p-6">
                <div className="relative aspect-[9/16] w-72 overflow-hidden rounded-xl bg-white shadow-lg">
                  {/* Mock mobile menu UI */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-16 bg-gradient-to-r from-emerald-600 to-teal-500 p-4 text-white">
                      <h3 className="text-lg font-bold">Delicious Eats</h3>
                      <p className="text-xs opacity-80">Scan to view our full menu</p>
                    </div>
                    <div className="flex-1 space-y-4 overflow-auto p-4">
                      <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Featured</h4>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Popular</span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-emerald-100"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Truffle Pasta</p>
                            <p className="text-xs text-zinc-500">Creamy pasta with truffle oil</p>
                            <p className="mt-1 text-sm font-semibold text-emerald-600">$18.99</p>
                          </div>
                        </div>
                      </div>
                      {/* More menu items */}
                    </div>
                    <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
                      <button className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white">
                        View Full Menu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating QR code */}
          <div className="absolute -bottom-8 -left-8 hidden lg:block">
            <div className="relative rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center rounded-lg">
                <QrCode className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
                <Smartphone className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
