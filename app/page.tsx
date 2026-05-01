"use client"
import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CategorySection } from "@/components/category-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturedProviders } from "@/components/featured-providers"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"

// Dynamically import the 3D hero component to avoid SSR issues with Three.js
const Hero3D = dynamic(
  () => import("@/components/3d-hero").then(mod => ({ default: mod.Hero3D })), 
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[70vh] flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-full h-full absolute inset-0" />
          <div className="relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }
)

export default function Home() {
  const router = useRouter()

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {/* Modern 3D Hero Section */}
        <Suspense fallback={<Skeleton className="w-full h-[70vh]" />}>
          <Hero3D />
        </Suspense>
        
        {/* Skill Exchange Intro Section */}
        <div className="py-12 bg-gradient-to-r from-maroon/5 to-olive/5 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              SkillPara lets you exchange skills with others
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
              No money? Teach something you know and learn something new.
            </p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              No money? Swap skills. No match? Use tokens.
            </p>
          </div>
        </div>

        {/* Positioning Line */}
        <div className="py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Not a course platform. A local skill economy.
            </p>
          </div>
        </div>
        <div className="my-20">
          <CategorySection />
        </div>

        {/* The SkillPara Ecosystem Flow */}
        <div className="py-20 bg-gradient-to-r from-maroon to-olive dark:from-purple-900 dark:to-blue-900 relative overflow-hidden">
          {/* Animated particles background */}
          <div className="absolute inset-0 bg-[url('/particles-light.svg')] dark:bg-[url('/particles-dark.svg')] opacity-20 bg-repeat"></div>
          
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              The SkillPara Ecosystem
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              
              {/* Pillar 1: The Swap */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-emerald-500/20 p-4 rounded-full mb-6">
                  <svg className="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">Hyper-Local Skill Swap</h3>
                <p className="text-slate-200">You teach coding, someone in your neighborhood fixes your car. Zero cash, pure community exchange.</p>
              </div>

              {/* Pillar 2: The Token Economy */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center scale-105 transform hover:scale-110 transition-transform duration-300">
                <div className="bg-amber-500/20 p-4 rounded-full mb-6">
                  <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-amber-300 mb-4">SkillTokens</h3>
                <p className="text-slate-200">The medium of exchange. Earn tokens when you provide a service; spend them to unlock others. Your skill is your currency.</p>
              </div>

              {/* Pillar 3: Trust & Verification */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-sky-500/20 p-4 rounded-full mb-6">
                  <svg className="w-12 h-12 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-sky-300 mb-4">Built-in Trust</h3>
                <p className="text-slate-200">Mandatory verification and public 'Trust Scores' based on actual service completion. Safe community exchanges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section with dark mode support */}
        <HowItWorks />

        {/* Enhanced Featured Providers Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive bg-clip-text text-transparent"
            >
              Featured Professionals
            </motion.h2>
            <FeaturedProviders />
          </div>
        </div>

        {/* Enhanced Call to Action Section */}
        <div className="relative py-24 overflow-hidden">
          {/* Background with dark mode support */}
          <div className="absolute inset-0 bg-gradient-to-r from-maroon to-olive dark:from-purple-800 dark:to-blue-800">
            {/* Animated particles */}
            <div className="absolute inset-0 bg-[url('/particles-light.svg')] dark:bg-[url('/particles-dark.svg')] opacity-20 bg-repeat"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              variants={staggerContainer as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <motion.h2 
                variants={fadeInUp as any}
                className="text-3xl md:text-5xl font-bold mb-6 text-white"
              >
                Ready to Get Started?
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp as any}
                className="text-xl mb-10 max-w-2xl mx-auto text-white/90"
              >
                Join our community of skilled professionals and clients today. Share your expertise or find the perfect professional for your needs.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp as any}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => router.push("/signup")}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>Sign Up Now</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Button>
                
                <Button
                  onClick={() => router.push("/how-it-works")}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800/30"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Decorative wave shape at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none" className="w-full h-[60px] text-white dark:text-gray-950">
              <path d="M0 96L48 85.3C96 75 192 53 288 58.7C384 64 480 96 576 96C672 96 768 64 864 74.7C960 85 1056 139 1152 144C1248 149 1344 107 1392 85.3L1440 64V160H0V96Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Testimonials Section (Optional enhancement) */}
        <div className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100"
            >
              What Our Users Are Saying
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Sarah J.",
                  role: "Graphic Designer",
                  quote: "skillpara has transformed how I find new clients. The platform is intuitive and the booking process is seamless.",
                },
                {
                  name: "Michael T.",
                  role: "Learning Piano",
                  quote: "I found an amazing piano teacher in my neighborhood. The skill swap feature allowed me to exchange my web design skills for lessons.",
                },
                {
                  name: "Priya K.",
                  role: "Yoga Instructor",
                  quote: "The flexibility to set my own schedule and rates has been game-changing for my yoga business. Highly recommended!",
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

