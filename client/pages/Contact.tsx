import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Clock, BookOpen } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
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

const iconVariants = {
  idle: { y: 0 },
  hover: {
    y: -5,
    rotate: 12,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 8,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const FloatingIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover">
    {children}
  </motion.div>
);

const AnimatedCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white perspective">
      <header className="container h-14 flex items-center justify-between border-b">
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
        <motion.a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          ← Back to Home
        </motion.a>
      </header>

      <main className="container py-12 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Have questions or need assistance? We're here to help! Reach out to
            us through any of these channels.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6">
            <AnimatedCard>
              <motion.div
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-xl transition-shadow h-full"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <FloatingIcon>
                      <Mail className="h-6 w-6 text-emerald-600" />
                    </FloatingIcon>
                  </div>
                  <div>
                    <motion.h2
                      className="text-xl font-semibold mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Email Us
                    </motion.h2>
                    <p className="text-muted-foreground mb-3">
                      Send us an email and we'll get back to you as soon as
                      possible.
                    </p>
                    <motion.a
                      href="mailto:connectsumedhbarsagade@gmail.com"
                      className="inline-flex items-center text-emerald-600 hover:underline font-medium"
                      whileHover={{ x: 5 }}
                    >
                      connectsumedhbarsagade@gmail.com
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <motion.div
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all h-full"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <FloatingIcon>
                      <Phone className="h-6 w-6 text-gray-500" />
                    </FloatingIcon>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <motion.h2
                        className="text-xl font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Call Us
                      </motion.h2>
                      <motion.span
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        If Urgent
                      </motion.span>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      For urgent matters, you can call us during business hours.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <motion.a
                          href="tel:+918830778401"
                          className="inline-flex items-center text-emerald-600 hover:underline font-medium"
                          whileHover={{ x: 5 }}
                        >
                          +91 88307 78401
                        </motion.a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Available 10 AM - 8 PM, Mon-Sat
                        </p>
                      </div>

                      <motion.div
                        className="p-3 bg-blue-50 rounded-lg text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="font-medium text-blue-800 mb-1">
                          Recommended message when calling:
                        </p>
                        <p className="text-blue-700">
                          "Hello, I'm calling about KhadyamQR. I need help with
                          [briefly describe your query]."
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <motion.div
                className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden h-full"
                whileHover={{
                  scale: 1.02,
                  rotateY: -5,
                }}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg"
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  RECOMMENDED
                </motion.div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <FloatingIcon>
                      <MessageCircle className="h-6 w-6 text-emerald-600" />
                    </FloatingIcon>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <motion.h2
                        className="text-xl font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        WhatsApp
                      </motion.h2>
                      <motion.span
                        className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.3,
                        }}
                      >
                        Fastest Response
                      </motion.span>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      Get quick assistance through WhatsApp. Our team is ready
                      to help you!
                    </p>
                    <div className="space-y-3">
                      <motion.a
                        href="https://wa.me/918830778401"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:underline font-medium"
                        whileHover={{ x: 5 }}
                      >
                        Message on WhatsApp
                      </motion.a>

                      <motion.div
                        className="p-3 bg-green-50 rounded-lg text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="font-medium text-green-800 mb-1">
                          Recommended message:
                        </p>
                        <p className="text-green-700 mb-2">
                          "Hello KhadyamQR Team,
                        </p>
                        <p className="text-green-700 mb-2">
                          I'm [Your Name] from [Restaurant Name]. I need help
                          with:
                        </p>
                        <p className="text-green-700">
                          • [Briefly describe your query]
                        </p>
                        <p className="text-green-700">
                          • [Any specific details]
                        </p>
                        <p className="text-green-700 mt-2">Thank you!"</p>
                      </motion.div>

                      <p className="text-xs text-muted-foreground">
                        Response time: Usually within 1-2 business hours
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedCard>
          </div>

          <div className="space-y-6">
            <AnimatedCard delay={0.15}>
              <motion.div
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FloatingIcon>
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </FloatingIcon>
                  <h2 className="text-xl font-semibold">Working Hours</h2>
                </div>
                <motion.div
                  className="space-y-2 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex justify-between"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <span>{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatedCard>

            <AnimatedCard delay={0.25}>
              <motion.div
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FloatingIcon>
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </FloatingIcon>
                  <h2 className="text-xl font-semibold">Help & Support</h2>
                </div>
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Check out our FAQ section for answers to common questions.
                </motion.p>
                <motion.a
                  href="/#faq"
                  className="inline-flex items-center text-emerald-600 hover:underline font-medium"
                  whileHover={{ x: 5 }}
                >
                  Visit Help Center →
                </motion.a>
              </motion.div>
            </AnimatedCard>
          </div>
        </motion.div>
      </main>

      <motion.footer
        className="container py-8 text-center text-sm text-muted-foreground border-t mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} KhadyamQR. All rights reserved.
      </motion.footer>
    </div>
  );
}
