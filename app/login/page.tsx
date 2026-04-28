"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const Scene = dynamic(() => import("@/components/login-3d-hero"), {
  ssr: false,
  loading: () => <div className="h-full rounded-[2rem] bg-[#F2E9DC]/30" />,
})

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace("/dashboard")
      }
    }

    checkSession()
  }, [router, supabase])

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message || "Unable to sign in. Please check your credentials.")
      setIsLoading(false)
      return
    }

    toast({
      title: "Welcome back to SkillPara",
      description: "Loading your dashboard and token wallet...",
    })

    router.replace("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F2E9DC] text-[#1F2937]">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-128px)] max-w-[1600px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 xl:grid-cols-[1.2fr_0.9fr] xl:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="hidden h-[720px] w-full xl:block"
          >
            <Scene />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="w-full rounded-[2rem] border border-[#7A1E2C]/10 bg-white/95 p-8 shadow-[0_35px_120px_rgba(122,30,44,0.12)] backdrop-blur-xl"
          >
            <div className="mb-8 space-y-4">
              <div className="inline-flex rounded-full bg-[#D96B2B]/10 px-4 py-2 text-sm font-semibold text-[#D96B2B]">
                New users start with 50 tokens
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-[#7A1E2C] sm:text-5xl">
                  Welcome back to SkillPara
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#A8B5B9]">
                  Learn. Teach. Connect. Earn credits by teaching or referring others, then spend them to unlock new skills.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-[#D96B2B]/20 bg-[#FFF1E8] p-4 text-sm text-[#7A1E2C]">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@skillpara.com"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center rounded-3xl bg-[#7A1E2C] px-6 py-3 text-base font-semibold text-[#F2E9DC] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#8b2738] sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <Link href="/forgot-password" className="text-sm font-medium text-[#D96B2B] hover:text-[#7A1E2C]">
                  Forgot Password?
                </Link>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#E7E1D8]" />
              <span className="text-sm uppercase tracking-[0.32em] text-[#A8B5B9]">or</span>
              <span className="h-px flex-1 bg-[#E7E1D8]" />
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                type="button"
                className="flex h-14 items-center justify-center gap-2 rounded-3xl border border-[#D96B2B] bg-white text-[#7A1E2C] transition hover:bg-[#D96B2B]/10"
                onClick={() => toast({ title: "Google login coming soon", description: "OAuth integration is on the roadmap." })}
              >
                Continue with Google
              </Button>
              <Button
                type="button"
                className="flex h-14 items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 text-slate-800 transition hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-700"
                onClick={() => router.push("/explore?demo=true")}
              >
                Browse Demo Profiles
              </Button>
              <p className="text-center text-sm text-[#A8B5B9]">
                New to SkillPara?{' '}
                <Link href="/signup" className="font-semibold text-[#7A1E2C] hover:text-[#7A1E2C]/90">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

