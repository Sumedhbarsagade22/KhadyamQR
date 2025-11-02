import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Owner, Pasta Paradise",
      content: "Since switching to KhadyamQR, our customers love the convenience of viewing our menu on their phones. We've seen a 30% increase in appetizer orders! The setup was incredibly easy.",
      rating: 5,
      image: "/avatars/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "Head Chef, Wok This Way",
      content: "Updating our menu used to be a hassle with printed menus. Now we can change items, update prices, and even feature daily specials in real-time. Game changer for our business!",
      rating: 5,
      image: "/avatars/michael.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "Manager, Taco Fiesta",
      content: "Our customers appreciate the contactless experience, and we love the analytics. We can see which items are popular and adjust our inventory accordingly. Highly recommended!",
      rating: 5,
      image: "/avatars/elena.jpg"
    }
  ]

  return (
    <section className="bg-zinc-50 py-16 dark:bg-zinc-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Loved by Restaurants Worldwide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Join thousands of restaurants that have transformed their customer experience
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-zinc-800/50"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 opacity-10 dark:bg-emerald-900/20" />
              
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="mt-6 text-zinc-600 dark:text-zinc-300">"{testimonial.content}"</p>
              
              <div className="mt-6 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {testimonial.rating}.0
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800/50 sm:flex-row sm:items-start sm:px-12 sm:py-8">
            <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 sm:mb-0 sm:mr-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Have questions?</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Our team is here to help you get started and answer any questions you might have.
              </p>
              <button className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                Contact our support team
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
