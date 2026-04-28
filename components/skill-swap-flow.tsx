"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { ChevronRight, ChevronLeft, CheckCircle2, Coins, MessageSquare, Calendar } from "lucide-react"

interface SkillSwapFlowProps {
  providerId: string
  providerName: string
  providerSkill: string
  tokenCost: number
  onClose?: () => void
  onSwapComplete?: () => void
}

const STEPS = [
  { number: 1, title: "Choose Skill", subtitle: "What do you want to learn?" },
  { number: 2, title: "Offer Skill", subtitle: "What can you offer in return?" },
  { number: 3, title: "Check Match", subtitle: "Let's see if it works" },
  { number: 4, title: "Token Cost", subtitle: "How much will it cost?" },
  { number: 5, title: "Connect", subtitle: "Start your skill swap!" },
]

const DEMO_SKILLS = [
  "Guitar",
  "Web Development",
  "Photography",
  "Cooking",
  "Yoga",
  "Spanish",
  "Piano",
  "Graphic Design",
  "English Speaking",
  "Business Management",
  "Fitness Training",
  "Video Editing",
]

export function SkillSwapFlow({
  providerId,
  providerName,
  providerSkill,
  tokenCost,
  onClose,
  onSwapComplete,
}: SkillSwapFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [skillToLearn, setSkillToLearn] = useState("")
  const [skillToOffer, setSkillToOffer] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("intermediate")
  const [availability, setAvailability] = useState("flexible")
  const [matchFound, setMatchFound] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSkills, setFilteredSkills] = useState<string[]>([])

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Fetch user wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from("credits_wallet")
          .select("balance")
          .eq("user_id", session.user.id)
          .single()

        if (data) {
          setUserBalance(data.balance)
        } else {
          setUserBalance(50) // Default fallback
        }
      }
    }
    fetchWallet()
  }, [])

  // Filter skills based on input
  const handleSkillInput = (input: string, isLearning = true) => {
    if (isLearning) {
      setSkillToLearn(input)
    } else {
      setSkillToOffer(input)
    }

    const filtered = DEMO_SKILLS.filter((skill) =>
      skill.toLowerCase().includes(input.toLowerCase())
    )
    setFilteredSkills(filtered)
    setShowSuggestions(filtered.length > 0 && input.length > 0)
  }

  // Handle step progression
  const nextStep = async () => {
    if (currentStep === 2) {
      // Validate Step 2
      if (!skillToLearn || !skillToOffer) {
        toast({
          title: "Missing Information",
          description: "Please fill in both skills to continue",
          variant: "destructive",
        })
        return
      }
    }

    if (currentStep === 3) {
      // Check for match - simulate API call
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Simple matching logic: if both skills are in demo list, it's a match
      const learnMatch = DEMO_SKILLS.some((s) =>
        s.toLowerCase() === skillToLearn.toLowerCase()
      )
      const offerMatch = DEMO_SKILLS.some((s) =>
        s.toLowerCase() === skillToOffer.toLowerCase()
      )
      
      // Check if provider accepts this skill swap (simulated)
      setMatchFound(learnMatch && offerMatch && Math.random() > 0.3)
      setIsLoading(false)
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartChat = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to start a chat",
          variant: "destructive",
        })
        return
      }

      // Create/start a conversation
      const { data: conversation, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: session.user.id,
            receiver_id: providerId,
            content: `Hi! I'm interested in a skill swap. I want to learn ${skillToLearn} and can offer ${skillToOffer} in return.`,
            is_read: false,
          },
        ])
        .select()
        .single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to start chat",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Chat Started!",
        description: `You've messaged ${providerName}. Check your messages!`,
      })

      if (onSwapComplete) {
        onSwapComplete()
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleRequestSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to request a session",
          variant: "destructive",
        })
        return
      }

      // Create booking
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([
          {
            learner_id: session.user.id,
            provider_id: providerId,
            skill_id: providerSkill,
            scheduled_date: new Date().toISOString(),
            duration_minutes: 60,
            status: "pending",
            booking_type: "skill_swap",
            swap_skill_offered: skillToOffer,
          },
        ])
        .select()
        .single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Session Requested!",
        description: `${providerName} will review your skill swap request.`,
      })

      if (onSwapComplete) {
        onSwapComplete()
      }
    } catch (error) {
      console.error("Error requesting session:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  // Determine remaining balance
  const remainingBalance = userBalance - tokenCost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-[2rem] bg-[#F2E9DC] shadow-2xl"
      >
        <div className="border-b border-[#7A1E2C]/10 p-6 sm:p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {STEPS.map((step) => (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                      currentStep >= step.number
                        ? "bg-[#D96B2B] text-white"
                        : "bg-[#E7E1D8] text-[#A8B5B9]"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </motion.div>
                  <p className="mt-2 text-center text-xs font-medium text-[#7A1E2C] hidden sm:block">
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#E7E1D8]">
              <motion.div
                className="h-full bg-[#D96B2B]"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#7A1E2C] sm:text-3xl">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="mt-2 text-[#A8B5B9]">{STEPS[currentStep - 1].subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Choose Skill to Learn */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="skill-to-learn" className="text-[#7A1E2C] font-semibold">
                    What skill do you want to learn?
                  </Label>
                  <div className="relative mt-3">
                    <Input
                      id="skill-to-learn"
                      placeholder="e.g., Guitar, Web Development..."
                      value={skillToLearn}
                      onChange={(e) => handleSkillInput(e.target.value, true)}
                      onFocus={() => skillToLearn && setShowSuggestions(true)}
                      className="rounded-2xl border-[#7A1E2C]/20 bg-white py-3 text-[#1F2937] placeholder-[#A8B5B9]"
                    />
                    {showSuggestions && filteredSkills.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 z-10 mt-2 rounded-2xl border border-[#7A1E2C]/10 bg-white shadow-lg"
                      >
                        {filteredSkills.slice(0, 5).map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              setSkillToLearn(skill)
                              setShowSuggestions(false)
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-[#D96B2B]/10 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            {skill}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#7C8F5A]/20 bg-[#7C8F5A]/5 p-4 text-sm text-[#7C8F5A]">
                  <p>💡 Pro tip: Be specific about what you want to learn for better matches!</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Offer Your Skill */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <Label htmlFor="skill-to-offer" className="text-[#7A1E2C] font-semibold">
                    What skill can you offer in return?
                  </Label>
                  <div className="relative mt-3">
                    <Input
                      id="skill-to-offer"
                      placeholder="e.g., English Teaching, Cooking..."
                      value={skillToOffer}
                      onChange={(e) => handleSkillInput(e.target.value, false)}
                      onFocus={() => skillToOffer && setShowSuggestions(true)}
                      className="rounded-2xl border-[#7A1E2C]/20 bg-white py-3 text-[#1F2937] placeholder-[#A8B5B9]"
                    />
                    {showSuggestions && filteredSkills.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 z-10 mt-2 rounded-2xl border border-[#7A1E2C]/10 bg-white shadow-lg"
                      >
                        {filteredSkills.slice(0, 5).map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              setSkillToOffer(skill)
                              setShowSuggestions(false)
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-[#D96B2B]/10 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            {skill}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience" className="text-[#7A1E2C] font-semibold">
                      Your Experience Level
                    </Label>
                    <select
                      id="experience"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-[#7A1E2C]/20 bg-white px-4 py-3 text-[#1F2937]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="availability" className="text-[#7A1E2C] font-semibold">
                      Your Availability
                    </Label>
                    <select
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-[#7A1E2C]/20 bg-white px-4 py-3 text-[#1F2937]"
                    >
                      <option value="flexible">Flexible</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="evenings">Evenings</option>
                      <option value="mornings">Mornings</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#7C8F5A]/20 bg-[#7C8F5A]/5 p-4 text-sm text-[#7C8F5A]">
                  <p>💡 Be honest about your skills—it helps providers decide faster!</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Matching Logic */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <Coins className="h-12 w-12 text-[#D96B2B]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-block"
                    >
                      {matchFound ? (
                        <CheckCircle2 className="h-12 w-12 text-[#7C8F5A]" />
                      ) : (
                        <div className="h-12 w-12 rounded-full border-2 border-[#D96B2B] flex items-center justify-center">
                          <span className="text-[#D96B2B] text-lg">✕</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3">
                  <Card className="border-[#7A1E2C]/10 bg-white">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#A8B5B9]">You want to learn:</span>
                          <span className="font-semibold text-[#7A1E2C]">{skillToLearn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A8B5B9]">You can offer:</span>
                          <span className="font-semibold text-[#7A1E2C]">{skillToOffer}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {matchFound ? (
                  <div className="rounded-2xl border border-[#7C8F5A]/30 bg-[#7C8F5A]/10 p-6 text-center">
                    <h3 className="font-bold text-[#7C8F5A]">✨ Great! Skill Swap Available</h3>
                    <p className="mt-2 text-sm text-[#7C8F5A]">
                      {providerName} accepts <strong>{skillToOffer}</strong> in exchange for teaching you <strong>{skillToLearn}</strong>!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-2xl border border-[#D96B2B]/30 bg-[#D96B2B]/10 p-6">
                    <div>
                      <h3 className="font-bold text-[#D96B2B]">No Direct Match Found</h3>
                      <p className="mt-2 text-sm text-[#7A1E2C]">
                        {providerName} is not currently accepting "{skillToOffer}" in exchange.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#D96B2B]/30 bg-white p-3">
                      <p className="text-sm text-[#A8B5B9]">
                        💡 <strong>No problem!</strong> You can still learn using your credits. Proceed to check the token cost.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Token Calculation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Card className="border-[#D96B2B]/20 bg-gradient-to-br from-[#D96B2B]/10 to-transparent">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#A8B5B9]">Session Cost</span>
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-[#D96B2B]" />
                            <span className="text-2xl font-bold text-[#D96B2B]">{tokenCost}</span>
                          </div>
                        </div>
                        <div className="h-px bg-[#D96B2B]/20" />
                        <div className="flex items-center justify-between">
                          <span className="text-[#A8B5B9]">Your Balance</span>
                          <span className="text-lg font-semibold text-[#7A1E2C]">{userBalance} 🪙</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {matchFound ? (
                    <div className="rounded-2xl border border-[#7C8F5A]/20 bg-[#7C8F5A]/10 p-4">
                      <p className="text-sm text-[#7C8F5A]">
                        <strong>✨ Tip:</strong> Since you have a skill swap match, this cost is optional. You can swap for free!
                      </p>
                    </div>
                  ) : null}

                  <Card className="border-[#7A1E2C]/10">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[#A8B5B9]">After booking:</span>
                          <div className="flex items-center gap-2">
                            <span className={remainingBalance >= 0 ? "text-[#7C8F5A]" : "text-[#D96B2B]"}>
                              {remainingBalance}
                            </span>
                            <span className="text-[#A8B5B9]">remaining</span>
                          </div>
                        </div>

                        {remainingBalance < 0 && (
                          <div className="rounded-xl border border-[#D96B2B]/30 bg-[#D96B2B]/10 p-3">
                            <p className="text-sm text-[#D96B2B]">
                              ⚠️ Insufficient balance. Add credits or choose a shorter session.
                            </p>
                          </div>
                        )}

                        {remainingBalance >= 0 && remainingBalance < 20 && (
                          <div className="rounded-xl border border-[#D96B2B]/30 bg-[#D96B2B]/10 p-3">
                            <p className="text-sm text-[#D96B2B]">
                              💡 You'll have {remainingBalance} credits left. Consider booking shorter sessions to stretch your balance.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-2xl border border-[#7C8F5A]/20 bg-[#7C8F5A]/5 p-4 text-sm text-[#7C8F5A]">
                  <p>
                    💡 <strong>Remember:</strong> You can earn credits by teaching skills or get referred bonuses!
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Contact / Action */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-[#7A1E2C]/10">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-[#7A1E2C]">Learning Plan</h3>
                        <p className="mt-2 text-sm text-[#A8B5B9]">
                          <strong>Skill:</strong> {skillToLearn} from {providerName}
                        </p>
                        <p className="mt-1 text-sm text-[#A8B5B9]">
                          <strong>Your Offer:</strong> {skillToOffer} ({experienceLevel})
                        </p>
                        <p className="mt-1 text-sm text-[#A8B5B9]">
                          <strong>Availability:</strong> {availability}
                        </p>
                      </div>

                      <div className="h-px bg-[#7A1E2C]/10" />

                      <div className="flex items-center gap-3 rounded-xl bg-[#D96B2B]/10 p-3">
                        <Coins className="h-5 w-5 text-[#D96B2B]" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#D96B2B]">This session costs {tokenCost} credits</p>
                          <p className="text-[#A8B5B9]">You have {userBalance} 🪙</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={handleStartChat}
                    className="w-full rounded-2xl bg-[#D96B2B] py-3 font-semibold text-white hover:bg-[#D96B2B]/90"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start Chat
                  </Button>

                  <Button
                    onClick={handleRequestSession}
                    disabled={remainingBalance < 0}
                    className="w-full rounded-2xl border border-[#D96B2B] bg-white py-3 font-semibold text-[#D96B2B] hover:bg-[#D96B2B]/10"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Request Session
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#7C8F5A]/20 bg-[#7C8F5A]/5 p-4 text-sm text-[#7C8F5A]">
                  <p>
                    ✨ <strong>Next Step:</strong> Chat with {providerName} to discuss schedule and preferences!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-[#7A1E2C]/10 bg-white/50 p-6 sm:p-8 rounded-b-[2rem] flex justify-between gap-4">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="rounded-2xl border-[#7A1E2C]/20 text-[#7A1E2C] hover:bg-[#F2E9DC]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              className="rounded-2xl bg-[#D96B2B] text-white hover:bg-[#D96B2B]/90"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="rounded-2xl bg-[#7A1E2C] text-white hover:bg-[#7A1E2C]/90"
            >
              Close
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
