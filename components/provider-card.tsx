"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, RefreshCw, ShieldCheck } from "lucide-react"

type ProviderCardProps = {
  provider: {
    id: string
    name: string
    profile_image: string
    location: string
    bio: string
    rating: number
    skills: { skill_name: string; category: string }[]
    available_now: boolean
    skill_swap: boolean
    trust_score?: number
    is_verified?: boolean
    distance?: number
  }
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const router = useRouter()
  const trustScore = provider.trust_score || 87
  const isVerified = provider.is_verified !== false
  const distance = provider.distance || 2.1

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 sm:h-auto sm:w-1/3">
          <Image
            src={provider.profile_image || "/placeholder.svg?height=160&width=160"}
            alt={provider.name}
            fill
            className="object-cover"
          />
          {provider.available_now && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center">
                <Clock className="mr-1 h-3 w-3" /> Available Now
              </Badge>
            </div>
          )}
        </div>
        <div className="flex-1 p-5">
          <div className="flex flex-col h-full">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold dark:text-gray-100">{provider.name}</h3>
              </div>

              {/* Trust & Verification Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                  trustScore >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' :
                  trustScore >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                }`}>
                  ⭐ {trustScore}% Trust
                </span>
                {isVerified && (
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Verified
                  </span>
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(provider.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{provider.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1 mb-3">
                <MapPin className="h-3 w-3 mr-1" />
                <span>Near you — {distance} km away</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {provider.skills?.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800">
                    {skill.skill_name}
                  </Badge>
                ))}
                {provider.skills?.length > 3 && <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">+{provider.skills.length - 3} more</Badge>}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {provider.bio || "This provider hasn't added a bio yet."}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between gap-3">
              <Badge variant="outline" className={`flex items-center ${provider.skill_swap ? "border-green-300 text-green-700 dark:border-green-800 dark:text-green-400" : "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300"}`}>
                {provider.skill_swap ? (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3" /> Skill Swap
                  </>
                ) : (
                  "Tokens or Paid"
                )}
              </Badge>

              <Button
                onClick={() => router.push(`/provider/${provider.id}`)}
                className="ml-auto bg-gradient-to-r from-maroon to-olive hover:from-maroon hover:to-olive dark:from-maroon dark:to-olive"
              >
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

