import { motion } from "framer-motion";
import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const scaleOnHover = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    // optional: ping server
    (async () => {
      try {
        const response = await fetch("/api/demo");
        const data = (await response.json()) as DemoResponse;
        setExampleFromServer(data.message);
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="container h-14 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 font-extrabold tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/khadyamqr-logo.svg"
            alt="KhadyamQR logo"
            className="h-8 w-8 rounded"
          />
          <span>KhadyamQR</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.a
            href="/restaurant-login"
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm hover:bg-accent"
            whileHover={{ scale: 1.05 }}
          >
            Restaurant Login
          </motion.a>
          <motion.a
            href="/admin"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
          >
            Admin
          </motion.a>
        </motion.div>
      </header>

      <main className="container py-16 grid gap-12">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            className="grid gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl lg:text-5xl font-extrabold leading-tight"
              variants={itemVariants}
            >
              Restaurant Menu QR System
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground"
              variants={itemVariants}
            >
              Create restaurants, upload menus with photos, and generate a
              persistent QR that always points to the live menu page. Built on
              Supabase. Deploy anywhere.
            </motion.p>

            <motion.div
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white shadow-lg"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
              }}
            >
              <div className="relative z-10">
                <motion.div
                  className="flex items-center gap-3 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-bold">
                    🚀 Transform Your Restaurant Menu
                  </h3>
                </motion.div>
                <motion.p
                  className="mb-4 text-emerald-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Upgrade to a{" "}
                  <span className="font-semibold text-white">
                    modern, contactless menu
                  </span>{" "}
                  experience with custom QR codes. No more reprinting menus -
                  update your offerings instantly!
                </motion.p>
                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <motion.a
                    href="tel:+918830778401"
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 shadow-md hover:bg-gray-100 transition-all hover:scale-105"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                    Call Now: +91 88307 78401
                  </motion.a>
                  <motion.a
                    href="https://wa.me/918830778401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-emerald-700/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-all hover:scale-105"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.5 14.4l-2.3 1.1-1.4 1.4c-.2.1-.4.2-.6.2-.2 0-.5-.1-.7-.2l-3.2-2.5c-.3-.2-.5-.4-.6-.7 0-.2 0-.5.1-.7l1.4-1.4-1.1-2.3c-.3-.6-.1-1.3.5-1.7l2.5-1.4c.5-.3 1.1-.2 1.5.2l2.3 2.3c.2.2.5.3.8.3.3 0 .6-.1.8-.3l.5-.5c.9-.9 1.3-2.1 1.1-3.3-.2-1.2-1-2.2-2.1-2.7-1.5-.6-3.2-.7-4.7-.3-2.9.8-5.1 3.5-5.1 6.6 0 1.3.4 2.6 1.1 3.7l-1.1 2.3c-.3.6-.1 1.3.5 1.7l1.4.8c.2.1.4.2.6.2.2 0 .5-.1.7-.2l2.3-1.1c1.1.6 2.3.9 3.6.9 3.1 0 5.8-2.2 6.6-5.1.4-1.5.3-3.1-.3-4.5-.5-1.1-1.5-1.9-2.7-2.1-1.2-.2-2.3.2-3.2 1.1l-.5.5c-.1.1-.3.1-.4 0l-2.3-2.3c-.1-.1-.1-.3 0-.4l1.4-2.5c.4-.7 1.1-1 1.9-.8.7.2 1.3.6 1.7 1.1.4.5.7 1.1.8 1.8.1.7-.1 1.4-.5 2l-1.1 1.9c-.1.2-.1.4 0 .6l.8 1.7c.1.2.4.4.6.4.1 0 .2 0 .3-.1l2.3-1.1c.2-.1.4-.1.6 0 .2 0 .4.1.5.2.4.3.7.7.9 1.2.2.5.3 1 .2 1.5-.1.5-.4 1-.8 1.4-.4.4-.9.7-1.4.8z" />
                    </svg>
                    WhatsApp Us
                  </motion.a>
                </motion.div>
              </div>
              <motion.div
                className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10"
                animate={floatingVariants.animate}
              />
              <motion.div
                className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/5"
                animate={{
                  y: [0, 20, 0],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={itemVariants}
            >
              <motion.a
                href="/restaurant-login"
                className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                {...scaleOnHover}
                whileTap={{ scale: 0.98 }}
              >
                Restaurant Login
              </motion.a>
              <motion.a
                href="/admin"
                className="inline-flex h-11 items-center rounded-md border px-6 hover:bg-accent"
                {...scaleOnHover}
                whileTap={{ scale: 0.98 }}
              >
                Admin Dashboard
              </motion.a>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <strong>Restaurant owners:</strong> Manage your menu •{" "}
              <strong>Admins:</strong> Manage all restaurants
            </motion.p>
            <motion.div
              className="text-xs text-muted-foreground"
              variants={itemVariants}
            >
              {exampleFromServer}
            </motion.div>
          </motion.div>

          <motion.div
            className="rounded-2xl border bg-white p-6 shadow-sm"
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            style={{ perspective: "1200px" }}
          >
            <motion.div
              className="grid gap-3"
              animate={floatingVariants.animate}
            >
              <div className="rounded-lg bg-emerald-100 h-40" />
              <div className="h-3 w-3/5 rounded bg-muted" />
              <div className="h-3 w-2/5 rounded bg-muted" />
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  className="h-24 rounded bg-muted"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgb(209, 250, 229)",
                  }}
                />
                <motion.div
                  className="h-24 rounded bg-muted"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgb(209, 250, 229)",
                  }}
                />
                <motion.div
                  className="h-24 rounded bg-muted"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgb(209, 250, 229)",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          id="how-it-works"
          className="grid lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl font-bold col-span-full text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          {[
            {
              icon: "🏪",
              title: "Create Restaurants",
              desc: "Add multiple restaurants, upload a logo, and auto-generate a clean slug.",
            },
            {
              icon: "🍽️",
              title: "Add Menu Items",
              desc: "Attach photos, descriptions, prices, and categories. Edits update instantly on public pages.",
            },
            {
              icon: "📱",
              title: "Generate QR",
              desc: "One QR per restaurant that always points to /menu/[slug]. Stable URL, no reprints.",
            },
          ].map((f, idx) => (
            <motion.div
              key={f.title}
              className="rounded-xl border bg-card p-6 text-center"
              variants={itemVariants}
              whileHover={{
                scale: 1.08,
                rotateY: 10,
                boxShadow: "0 15px 35px rgba(16, 185, 129, 0.2)",
              }}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: idx * 0.3,
                }}
              >
                {f.icon}
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          id="features"
          className="grid gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h2>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "📁",
                title: "Menu Categories",
                desc: "Organize items into Starters, Main Course, Desserts, etc.",
              },
              {
                icon: "📸",
                title: "Photo Upload",
                desc: "Add beautiful photos to your menu items",
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                desc: "Changes reflect instantly on public menu",
              },
              {
                icon: "🔄",
                title: "Easy Management",
                desc: "Simple dashboard for restaurant owners",
              },
              {
                icon: "🎨",
                title: "Professional Design",
                desc: "Modern, mobile-friendly menu pages",
              },
              {
                icon: "🔒",
                title: "Secure",
                desc: "Built on Supabase with RLS policies",
              },
              {
                icon: "⏸️",
                title: "Enable/Disable",
                desc: "Control restaurant and item availability",
              },
              {
                icon: "💾",
                title: "Persistent QR",
                desc: "QR codes never change, even after updates",
              },
            ].map((f, idx) => (
              <motion.div
                key={f.title}
                className="rounded-lg border bg-card p-4"
                variants={itemVariants}
                whileHover={{
                  scale: 1.12,
                  rotateX: -5,
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)",
                }}
                style={{ perspective: "800px" }}
              >
                <motion.div
                  className="text-2xl mb-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.15,
                  }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="faq"
          className="grid gap-6 max-w-3xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div className="grid gap-4">
            {[
              {
                q: "How does it work?",
                a: "Create a restaurant, add menu items with photos and prices, generate a QR code, and share it with customers. They scan the QR to view your live menu.",
              },
              {
                q: "Can I update my menu after generating the QR?",
                a: "Yes! The QR code points to a permanent URL. Update your menu anytime and changes appear instantly - no need to reprint QR codes.",
              },
              {
                q: "How do I organize my menu?",
                a: "Menu items support categories like Starters, Main Course, Desserts, Beverages, etc. Your public menu automatically groups items by category.",
              },
              {
                q: "Who can access what?",
                a: "Admins manage all restaurants and generate QR codes. Restaurant owners can only manage their own menu items. Public menus are accessible to everyone.",
              },
              {
                q: "What if I need help?",
                a: "Contact your admin for restaurant setup and credentials. Check the documentation files for detailed guides.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                className="rounded-lg border bg-card p-5"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  x: 10,
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.1)",
                }}
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="cta"
          className="text-center py-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          whileHover={{
            boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)",
          }}
        >
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-emerald-50 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join restaurants using KhadyamQR to provide modern, digital menus to
            their customers.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href="/restaurant-login"
              className="inline-flex h-12 items-center rounded-md bg-white text-emerald-600 px-8 font-semibold hover:bg-emerald-50"
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Restaurant Login
            </motion.a>
            <motion.a
              href="/admin"
              className="inline-flex h-12 items-center rounded-md border-2 border-white text-white px-8 font-semibold hover:bg-white/10"
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Admin Dashboard
            </motion.a>
          </motion.div>
        </motion.section>
      </main>

      <motion.footer
        className="border-t bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <motion.div
                className="flex items-center gap-2 font-bold mb-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src="/khadyamqr-logo.svg"
                  alt="KhadyamQR"
                  className="h-6 w-6 rounded"
                />
                <span>KhadyamQR</span>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Modern QR-based menu management for restaurants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <motion.a
                  href="#how-it-works"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  How It Works
                </motion.a>
                <motion.a
                  href="#features"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#faq"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  FAQ
                </motion.a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Access</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <motion.a
                  href="/restaurant-login"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Restaurant Login
                </motion.a>
                <motion.a
                  href="/admin"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Admin Dashboard
                </motion.a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <motion.a
                  href="/privacy-policy"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="/terms-of-service"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href="/contact"
                  className="hover:text-foreground"
                  whileHover={{ x: 5 }}
                >
                  Contact Us
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              © {new Date().getFullYear()} KhadyamQR. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
