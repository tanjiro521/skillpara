import React from "react"
import { ShieldCheck, Star } from "lucide-react"

export function TrustBadge({ trustScore }: { trustScore: number }) {
  // Determine color based on score
  let colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
  if (trustScore < 70) colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
  if (trustScore < 40) colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colorClass}`}>
      {trustScore}% Trust
    </span>
  )
}

export function VerifiedBadge({ isVerified }: { isVerified: boolean }) {
  if (!isVerified) return null;

  return (
    <span className="inline-flex items-center text-blue-600 dark:text-blue-400 text-xs font-semibold" title="Verified Identity">
      <ShieldCheck className="w-4 h-4 mr-1" />
      Verified
    </span>
  )
}

export function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({rating.toFixed(1)})</span>
    </div>
  )
}
