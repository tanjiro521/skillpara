"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Provider {
  id: string
  name: string
  profile_image: string
  bio: string
  rating: number
  skills: string[]
  location: string
  distance?: string
  payment_mode?: string
  trust_score?: number
  verified?: boolean
  reviewCount: number
}

export function FeaturedProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const controls = useAnimation()
  const slideContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // In a real app, this would fetch from the database
        // For demo purposes, we're using mock data
        const mockProviders = [
          {
            id: "1",
            name: "Rahul Verma",
            profile_image: "/placeholder.svg?height=128&width=128",
            bio: "Passionate guitar player. Will teach you chords in exchange for coding lessons.",
            rating: 4.9,
            skills: ["Acoustic Guitar", "Music Theory"],
            location: "Koramangala, BLR",
            distance: "1.2 km near you",
            payment_mode: "Skill Swap",
            trust_score: 92,
            verified: true,
            reviewCount: 14
          },
          {
            id: "2",
            name: "Sanjay Electric",
            profile_image: "/placeholder.svg?height=128&width=128",
            bio: "Licensed electrician for all home repairs and wiring.",
            rating: 4.8,
            skills: ["Electrical Repair", "Wiring", "Installation"],
            location: "Indiranagar, BLR",
            distance: "3.5 km near you",
            payment_mode: "₹ or Tokens",
            trust_score: 98,
            verified: true,
            reviewCount: 156
          },
          {
            id: "3",
            name: "Priya Tech",
            profile_image: "/placeholder.svg?height=128&width=128",
            bio: "Senior Dev offering React & Next.js mentorship.",
            rating: 5.0,
            skills: ["React", "Next.js", "System Design"],
            location: "HSR Layout, BLR",
            distance: "4.1 km near you",
            payment_mode: "Tokens Only",
            trust_score: 87,
            verified: false,
            reviewCount: 32
          },
          {
            id: "4",
            name: "Amit Fitness",
            profile_image: "/placeholder.svg?height=128&width=128",
            bio: "Personal trainer focusing on calisthenics and mobility.",
            rating: 4.7,
            skills: ["Calisthenics", "Mobility", "Diet"],
            location: "Whitefield, BLR",
            distance: "6.0 km near you",
            payment_mode: "Skill Swap",
            trust_score: 81,
            verified: true,
            reviewCount: 29
          }
        ]
        
        setProviders(mockProviders)
      } catch (error) {
        console.error("Error fetching featured providers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  const handleNextSlide = () => {
    if (currentSlide < providers.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      setCurrentSlide(0)
    }
  }

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else {
      setCurrentSlide(providers.length - 1)
    }
  }

  const handleViewProfile = (id: string) => {
    router.push(`/provider/${id}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  }

  // Calculate the rating with decimals
  const renderRating = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <Star 
                key={i} 
                className="h-4 w-4 text-yellow-500 fill-yellow-500" 
              />
            )
          } else if (i === fullStars && decimalPart > 0) {
            // Show partial filled star
            return (
              <div key={i} className="relative h-4 w-4">
                <Star className="absolute h-4 w-4 text-gray-300 dark:text-gray-600" />
                <div className="absolute overflow-hidden h-4" style={{ width: `${decimalPart * 100}%` }}>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            )
          } else {
            return (
              <Star 
                key={i} 
                className="h-4 w-4 text-gray-300 dark:text-gray-600" 
              />
            )
          }
        })}
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      </div>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive bg-clip-text text-transparent">
              Featured Skill Providers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover top-rated skill providers in your community
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive rounded-full mt-3"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={() => router.push("/explore")} 
              variant="outline" 
              className="mt-4 md:mt-0 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 hover:text-purple-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-200 transition-colors group"
            >
              View All Providers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              {/* Desktop view: grid layout */}
              <motion.div
                variants={containerVariants as any}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    variants={itemVariants as any}
                    whileHover={{ 
                      y: -8, 
                      transition: { 
                        type: "spring", 
                        stiffness: 300,
                        damping: 15
                      } 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-900/20 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50 h-full flex flex-col group cursor-pointer"
                      onClick={() => handleViewProfile(provider.id)}
                    >
                      <div className="h-36 relative bg-gradient-to-r from-maroon/20 to-olive/20 dark:from-purple-900/40 dark:to-blue-900/40">
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 group-hover:bg-white/0 dark:group-hover:bg-black/0 transition-colors duration-300"></div>
                        <Avatar className="absolute h-24 w-24 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white dark:border-gray-800 shadow-lg transition-transform group-hover:scale-105 group-hover:border-purple-100 dark:group-hover:border-purple-900">
                          <AvatarImage src={provider.profile_image} alt={provider.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 text-xl">
                            {provider.name.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="pt-16 px-5 pb-5 flex-grow flex flex-col">
                        <h3 className="text-xl font-semibold text-center mb-1.5 text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-center gap-1">
                          {provider.name}
                          {provider.verified && (
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </h3>
                        <div className="flex items-center justify-center mb-3">
                          {renderRating(provider.rating, provider.reviewCount)}
                        </div>
                        <div className="flex flex-col items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-3 gap-1">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-red-500" />
                            {provider.location}
                          </div>
                          {provider.distance && <span className="text-green-600 dark:text-green-400 font-medium">{provider.distance}</span>}
                        </div>
                        
                        {provider.trust_score && (
                          <div className="flex justify-center mb-2">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/70 dark:text-blue-300">
                              🛡️ Trust Score: {provider.trust_score}%
                            </Badge>
                          </div>
                        )}
                        {provider.payment_mode && (
                          <div className="flex justify-center mb-3">
                            <Badge className="bg-gradient-to-r from-maroon to-olive text-white border-none shadow-sm">
                              {provider.payment_mode}
                            </Badge>
                          </div>
                        )}

                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {provider.skills.map((skill, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/70 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 text-center mb-4">
                          {provider.bio}
                        </p>
                        <div className="mt-auto flex justify-center w-full">
                          <Button 
                            className="w-full bg-gradient-to-r from-maroon to-olive hover:from-purple-700 hover:to-blue-700 dark:from-maroon dark:to-olive dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-shadow"
                            size="sm"
                          >
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile view: carousel */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={slideContainerRef}>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div 
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="px-4"
                    >
                      <div 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                        onClick={() => handleViewProfile(providers[currentSlide].id)}
                      >
                        <div className="p-6 flex flex-col items-center">
                          <div className="h-28 w-28 rounded-full bg-gradient-to-r from-maroon/20 to-olive/20 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mb-5">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800">
                              <AvatarImage src={providers[currentSlide].profile_image} alt={providers[currentSlide].name} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 text-xl">
                                {providers[currentSlide].name.split(' ').map(name => name[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-1">
                            {providers[currentSlide].name}
                            {providers[currentSlide].verified && (
                              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </h3>
                          <div className="flex items-center mb-3">
                            {renderRating(providers[currentSlide].rating, providers[currentSlide].reviewCount)}
                          </div>
                          
                          <div className="flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-4 gap-1">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-red-500" />
                              {providers[currentSlide].location}
                            </div>
                            {providers[currentSlide].distance && <span className="text-green-600 dark:text-green-400 font-medium">{providers[currentSlide].distance}</span>}
                          </div>

                          {providers[currentSlide].trust_score && (
                            <div className="flex justify-center mb-2">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/70 dark:text-blue-300">
                                🛡️ Trust Score: {providers[currentSlide].trust_score}%
                              </Badge>
                            </div>
                          )}
                          {providers[currentSlide].payment_mode && (
                            <div className="flex justify-center mb-4">
                              <Badge className="bg-gradient-to-r from-maroon to-olive text-white border-none shadow-sm">
                                {providers[currentSlide].payment_mode}
                              </Badge>
                            </div>
                          )}

                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {providers[currentSlide].skills.map((skill, index) => (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/70"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                            {providers[currentSlide].bio}
                          </p>
                          <Button 
                            className="w-full bg-gradient-to-r from-maroon to-olive hover:from-purple-700 hover:to-blue-700 dark:from-maroon dark:to-olive dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-md"
                          >
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel controls */}
                <div className="flex justify-center items-center space-x-3 mt-8">
                  {providers.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "w-8 bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive"
                          : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Navigation arrows for mobile */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden bg-white dark:bg-gray-800 rounded-full p-3 shadow-md border border-gray-200 dark:border-gray-700 z-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                aria-label="Previous provider"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden bg-white dark:bg-gray-800 rounded-full p-3 shadow-md border border-gray-200 dark:border-gray-700 z-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                aria-label="Next provider"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

