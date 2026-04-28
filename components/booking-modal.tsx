"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, RefreshCw, Zap } from "lucide-react"
import { SkillSwapFlow } from "@/components/skill-swap-flow"

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Skill {
  id: string;
  skill_name: string;
  category: string;
  intent: string;
}

type BookingModalProps = {
  provider: any
  currentUser: any
  isOpen: boolean
  onClose: () => void
  onSuccess?: (bookingData: any) => void
}

export function BookingModal({ provider, currentUser, isOpen, onClose, onSuccess }: BookingModalProps) {
  const CREDIT_COST = 50
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingMode, setBookingMode] = useState<"swap" | "credits">("credits")
  const [selectedSeekerSkill, setSelectedSeekerSkill] = useState<string | null>(null)
  const [showSkillSwapFlow, setShowSkillSwapFlow] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const providerSeekerSkills = provider.skills?.filter((skill: Skill) => skill.intent === "seeker") || []
  const seekerOfferSkills = currentUser?.skills?.filter((skill: Skill) => skill.intent === "provider") || []
  const swapMatchSkills = seekerOfferSkills.filter((userSkill: Skill) =>
    providerSeekerSkills.some(
      (seekSkill: Skill) =>
        seekSkill.skill_name.toLowerCase() === userSkill.skill_name.toLowerCase() ||
        seekSkill.category === userSkill.category
    )
  )
  const directSwapAvailable = provider.skill_swap && swapMatchSkills.length > 0

  useEffect(() => {
    if (!provider || !currentUser) return
    if (directSwapAvailable) {
      setBookingMode("swap")
    } else {
      setBookingMode("credits")
    }
  }, [provider, currentUser, directSwapAvailable])

  // Filter available slots and sort them by date and time
  const availableSlots = (provider.availability_slots?.filter((slot: Slot) => slot.is_available) || [])
    .sort((a: Slot, b: Slot) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.start_time.localeCompare(b.start_time)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot.",
        variant: "destructive",
      })
      return
    }

    const isSkillSwap = bookingMode === "swap"
    const isCreditBooking = bookingMode === "credits"

    if (isSkillSwap && !selectedSeekerSkill) {
      toast({
        title: "Error",
        description: "Please select a skill to swap.",
        variant: "destructive",
      })
      return
    }

    if (isCreditBooking && currentUser?.wallet_balance < CREDIT_COST) {
      toast({
        title: "Insufficient credits",
        description: "You need more credits to use this booking option.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const selectedSlotData = availableSlots.find((slot: Slot) => slot.id === selectedSlot)

      if (!selectedSlotData) {
        throw new Error("Selected time slot not found")
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          provider_id: provider.id,
          seeker_id: currentUser.id,
          slot_id: selectedSlot,
          date: selectedSlotData.date,
          start_time: selectedSlotData.start_time,
          end_time: selectedSlotData.end_time,
          service_name: provider.skills?.[0]?.skill_name || "Skill Service",
          notes: notes,
          status: "pending",
          payment_status: isSkillSwap ? "not_required" : isCreditBooking ? "paid" : "pending",
          is_skill_swap: isSkillSwap,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          provider:provider_id(*),
          seeker:seeker_id(*),
          slot:slot_id(*)
        `)
        .single()

      if (bookingError) throw bookingError

      if (isSkillSwap && selectedSeekerSkill) {
        const { error: swapError } = await supabase
          .from('skill_swap_agreements')
          .insert([{
            proposer_id: currentUser.id,
            recipient_id: provider.id,
            proposer_skill_id: selectedSeekerSkill,
            recipient_skill_id: provider.skills?.[0]?.id,
            status: 'pending',
          }])

        if (swapError) throw swapError
      }

      if (isCreditBooking) {
        const { error: deductError } = await supabase
          .from('credits_wallet')
          .update({
            balance: currentUser.wallet_balance - CREDIT_COST,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', currentUser.id)

        if (deductError) throw deductError

        const { error: providerWalletError } = await supabase
          .from('credits_wallet')
          .update({ updated_at: new Date().toISOString() })
          .eq('user_id', provider.id)
          .increment('balance', CREDIT_COST)
          .increment('total_earned', CREDIT_COST)

        if (providerWalletError) {
          console.warn('Provider wallet update failed:', providerWalletError)
        }

        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            sender_id: currentUser.id,
            receiver_id: provider.id,
            amount: CREDIT_COST,
            type: 'learning',
            reference_id: bookingData.id,
            description: `Credits payment for ${bookingData.service_name}`,
            created_at: new Date().toISOString(),
          }])

        if (transactionError) {
          console.warn('Transaction creation failed:', transactionError)
        }
      }

      const { error: slotError } = await supabase
        .from('availability_slots')
        .update({ is_available: false })
        .eq('id', selectedSlot)

      if (slotError) throw slotError

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: provider.id,
          type: isSkillSwap ? 'skill_swap_request' : 'new_booking',
          title: isSkillSwap ? 'New Skill Swap Request' : 'New Booking Request',
          message: isSkillSwap
            ? `${currentUser.name} has requested to swap their ${currentUser.skills?.find((s: Skill) => s.id === selectedSeekerSkill)?.skill_name} for your ${provider.skills?.[0]?.skill_name}`
            : `${currentUser.name} has requested to book a session for ${provider.skills?.[0]?.skill_name}`,
          data: {
            booking_id: bookingData.id,
            is_skill_swap: isSkillSwap,
            swap_skill_id: selectedSeekerSkill,
          }
        }])

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
      }

      toast({
        title: "Success!",
        description: isSkillSwap
          ? "Your skill swap request has been sent to the provider."
          : isCreditBooking
          ? "Your credits payment has been applied and the booking request is now pending provider confirmation."
          : "Your booking request has been sent to the provider.",
      })

      if (onSuccess) {
        onSuccess(bookingData)
      }

      onClose()
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showSkillSwapFlow && (
        <SkillSwapFlow
          providerId={provider.id}
          providerName={provider.name}
          providerSkill={provider.skills?.[0]?.skill_name || "Skill"}
          tokenCost={CREDIT_COST}
          onClose={() => {
            setShowSkillSwapFlow(false)
            onClose()
          }}
          onSwapComplete={() => {
            setShowSkillSwapFlow(false)
            onClose()
            if (onSuccess) {
              onSuccess(null)
            }
          }}
        />
      )}
      
      <Dialog open={isOpen && !showSkillSwapFlow} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book a Session with {provider.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Select a Time Slot</Label>
                {availableSlots.length > 0 ? (
                <RadioGroup value={selectedSlot || ""} onValueChange={setSelectedSlot}>
                  <div className="grid grid-cols-1 gap-2">
                    {availableSlots.map((slot: Slot) => (
                      <div key={slot.id}>
                        <RadioGroupItem value={slot.id} id={slot.id} className="peer sr-only" />
                        <Label
                          htmlFor={slot.id}
                          className="flex flex-col items-start p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                        >
                          <div className="flex items-center w-full justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {new Date(slot.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                              </span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-center py-4 text-gray-500">No available time slots. Please check back later.</p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label>Choose Booking Option</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      bookingMode === "swap"
                        ? "border-purple-600 bg-purple-50 text-purple-800"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setShowSkillSwapFlow(true)}
                  >
                    <Zap className="h-4 w-4 inline mr-2" />
                    Guided Skill Swap
                  </button>
                  <button
                    type="button"
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      bookingMode === "credits"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setBookingMode("credits")}
                  >
                    Use Credits
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                {bookingMode === "credits" ? (
                  <p>
                    Use your credits to book this skill. You have the flexibility to learn at your own pace.
                  </p>
                ) : (
                  <p>
                    Try our interactive Skill Swap Flow to find matches, check availability, and connect directly with {provider.name}.
                  </p>
                )}
              </div>

              {bookingMode === "swap" && currentUser.skills?.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Your Skill to Swap</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentUser.skills
                      ?.filter((skill: Skill) => skill.intent === "provider")
                      .map((skill: Skill) => (
                        <div
                          key={skill.id}
                          className={`p-3 border rounded-md cursor-pointer ${
                            selectedSeekerSkill === skill.id
                              ? "border-purple-600 bg-purple-50"
                              : "hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedSeekerSkill(skill.id)}
                        >
                          <h4 className="font-medium">{skill.skill_name}</h4>
                          <p className="text-sm text-gray-500">{skill.category}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {bookingMode === "credits" && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium">Pay with Credits</h4>
                        <p className="text-sm text-gray-500">Spend credits immediately and reserve your session.</p>
                      </div>
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
                        {CREDIT_COST} credits
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      You have <span className="font-semibold text-gray-800 dark:text-gray-100">{currentUser?.wallet_balance ?? 0}</span> credits available.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or questions for the provider?"
                rows={3}
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider:</span>
                    <span>{provider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span>{provider.skills?.[0]?.skill_name || "Skill Service"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span>60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span>Online or In-person</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {bookingMode === "swap"
                        ? "Free (Skill Exchange)"
                        : `${CREDIT_COST} credits`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-maroon to-olive hover:from-purple-700 hover:to-blue-700"
              disabled={!selectedSlot || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

