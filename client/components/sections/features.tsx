import { Zap, Smartphone, BarChart, Settings, MessageSquare, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Lightning Fast Setup",
      description: "Get your digital menu up and running in under 5 minutes. No technical skills required."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Mobile-Optimized",
      description: "Looks stunning on any device, from smartphones to tablets and desktops."
    },
    {
      icon: <BarChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Real-time Analytics",
      description: "Track menu performance, popular items, and customer engagement in real-time."
    },
    {
      icon: <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Easy Updates",
      description: "Change your menu anytime, anywhere. Updates appear instantly for your customers."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Customer Feedback",
      description: "Collect ratings and reviews directly through your digital menu."
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your information."
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            KhadyamQR provides all the tools you need to create an exceptional digital dining experience.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-emerald-900/20" />
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-white shadow-xl sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">Ready to Transform Your Restaurant?</h3>
            <p className="mx-auto mt-4 max-w-xl text-emerald-100">
              Join thousands of restaurants that have already upgraded their dining experience with KhadyamQR.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 sm:w-auto">
                Start Free Trial
              </button>
              <button className="w-full rounded-lg border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
