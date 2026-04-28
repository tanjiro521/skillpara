"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BookingsList } from "@/components/bookings-list"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { ProfileSection } from "@/components/profile-section"
import { SkillsSection } from "@/components/skills-section"
import { NotificationsList } from "@/components/notifications-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

// Client component that safely uses useSearchParams
function TabParamsHandler({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const validTabs = ['bookings', 'availability', 'profile', 'skills', 'notifications']
  
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      onTabChange(tabParam)
    }
  }, [tabParam, onTabChange])
  
  return null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const validTabs = ['bookings', 'availability', 'profile', 'skills', 'notifications']
  const [activeTab, setActiveTab] = useState("bookings")
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const bookingsListRef = useRef<any>(null)

  const updateActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        router.replace("/login")
        return
      }

      const userId = session.user.id
      let profileData = null

      try {
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, name, role, location, profile_image, bio, phone, current_mode")
          .eq("id", userId)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') { // No rows returned
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([{
                id: userId,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                role: session.user.user_metadata?.role || 'both',
                current_mode: 'learner',
                profile_image: "/placeholder.svg?height=200&width=200",
                bio: "",
                phone: "",
                location: "",
              }])
              .select("id, email, name, role, location, profile_image, bio, phone, current_mode")
              .single()

            if (createError) {
              // If table doesn't exist or creation fails, use basic profile data
              profileData = {
                id: userId,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                role: session.user.user_metadata?.role || 'both',
                current_mode: 'learner',
                profile_image: "/placeholder.svg?height=200&width=200",
                bio: "",
                phone: "",
                location: "",
              }
            } else {
              profileData = newProfile
            }
          } else if (profileError.message?.includes('relation "public.profiles" does not exist')) {
            // Table doesn't exist, use basic profile data
            profileData = {
              id: userId,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: session.user.user_metadata?.role || 'both',
              current_mode: 'learner',
              profile_image: "/placeholder.svg?height=200&width=200",
              bio: "",
              phone: "",
              location: "",
            }
          } else {
            throw profileError
          }
        } else {
          profileData = existingProfile
        }
      } catch (error) {
        // Fallback to basic profile data
        profileData = {
          id: userId,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'both',
          current_mode: 'learner',
          profile_image: "/placeholder.svg?height=200&width=200",
          bio: "",
          phone: "",
          location: "",
        }
      }

      if (!profileData) {
        throw new Error("User profile not found")
      }

      let walletBalance = 50
      let walletTotalEarned = 50

      try {
        const { data: walletData, error: walletError } = await supabase
          .from("credits_wallet")
          .select("balance, total_earned")
          .eq("user_id", userId)
          .single()

        if (!walletError && walletData) {
          walletBalance = walletData.balance
          walletTotalEarned = walletData.total_earned
        } else {
          // Try to create wallet if it doesn't exist
          const { data: createdWallet, error: createError } = await supabase
            .from("credits_wallet")
            .insert([{ user_id: userId, balance: 50, total_earned: 50 }])
            .select()
            .single()

          if (!createError && createdWallet) {
            walletBalance = createdWallet.balance
            walletTotalEarned = createdWallet.total_earned
          }
          // If creation fails (table doesn't exist), keep default values
        }
      } catch (error) {
        // If wallet table doesn't exist, keep default values
        console.warn("Wallet table not accessible, using default values")
      }

      setUser({
        ...profileData,
        wallet_balance: walletBalance,
        wallet_total_earned: walletTotalEarned,
      })
    } catch (error: any) {
      console.error("Dashboard error:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, router, toast])

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = useCallback(() => {
    console.log("Dashboard: handleProfileUpdate called - refreshing user data");
    fetchUserData();
  }, [fetchUserData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/dashboard?tab=${value}`, { scroll: false })
  }

  const fetchBookings = () => {
    if (bookingsListRef.current?.fetchBookings) {
      bookingsListRef.current.fetchBookings();
    }
  }

  useEffect(() => {
    if (!user) return

    const notificationsChannel = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...(prev || [])])
          setUnreadCount(prev => prev + 1)
          
          toast({
            title: payload.new.title,
            description: payload.new.message,
          })

          if (payload.new.data?.booking_id) {
            if (activeTab === "bookings") {
              fetchBookings()
            }
          }
        }
      )
      .subscribe()

    const fetchNotifications = async () => {
      try {
        const { data: notifs, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && notifs) {
          setNotifications(notifs || [])
          setUnreadCount((notifs || []).filter(n => !n.is_read).length)
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setNotifications([])
        setUnreadCount(0)
      }
    }

    fetchNotifications()

    return () => {
      supabase.removeChannel(notificationsChannel)
    }
  }, [user, toast, supabase, activeTab])

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications((notifications || []).map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-500"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl mb-4">Unable to load user profile</h2>
            <Button onClick={() => router.push("/login")}>Return to Login</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      
      <Suspense fallback={null}>
        <TabParamsHandler onTabChange={updateActiveTab} />
      </Suspense>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DashboardSidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            unreadCount={unreadCount} 
          />

          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8 rounded-[2rem] border border-[#D96B2B]/15 bg-[#F2E9DC] p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7A1E2C]">SkillPara wallet</p>
                    <h2 className="text-3xl font-bold text-[#7A1E2C]">Welcome back, {user.name || user.email}</h2>
                    <p className="max-w-2xl text-sm leading-6 text-[#5B6B70]">Skills are converted into credits. Teach to earn, refer to boost your balance, and spend tokens to learn new skills faster.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-1">
                    <div className="rounded-3xl border border-[#7A1E2C]/10 bg-white p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.32em] text-[#7A1E2C]">Token balance</p>
                      <p className="mt-4 text-4xl font-bold text-[#D96B2B]">{user.wallet_balance ?? 50}</p>
                      <p className="mt-2 text-sm text-[#5B6B70]">tokens available</p>
                      <Button
                        type="button"
                        onClick={() => router.push('/wallet')}
                        className="mt-5 w-full rounded-2xl bg-[#D96B2B]/10 px-4 py-3 text-sm font-semibold text-[#7A1E2C] transition hover:bg-[#D96B2B]/20"
                      >
                        View Wallet
                      </Button>
                    </div>
                    <div className="rounded-3xl border border-[#D96B2B]/15 bg-[#FFF1E8] p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.32em] text-[#7A1E2C]">Quick actions</p>
                      <div className="mt-4 flex flex-col gap-3">
                        <button type="button" onClick={() => router.push('/explore')} className="rounded-2xl bg-[#7A1E2C] px-4 py-3 text-sm font-semibold text-[#F2E9DC] transition hover:bg-[#8f2f45]">Learn Skill</button>
                        <button type="button" onClick={() => router.push('/community')} className="rounded-2xl border border-[#D96B2B] bg-white px-4 py-3 text-sm font-semibold text-[#7A1E2C] transition hover:bg-[#D96B2B]/10">Teach Skill</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-5 mb-8 bg-muted/50 dark:bg-gray-800/50">
                  <TabsTrigger value="bookings" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 dark:text-gray-200 dark:data-[state=active]:text-white">Bookings</TabsTrigger>
                  <TabsTrigger value="availability" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 dark:text-gray-200 dark:data-[state=active]:text-white">Availability</TabsTrigger>
                  <TabsTrigger value="profile" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 dark:text-gray-200 dark:data-[state=active]:text-white">Profile</TabsTrigger>
                  <TabsTrigger value="skills" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 dark:text-gray-200 dark:data-[state=active]:text-white">Skills</TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 dark:text-gray-200 dark:data-[state=active]:text-white">
                    Notifications
                    {unreadCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bookings">
                  <BookingsList ref={bookingsListRef} user={user} />
                </TabsContent>

                <TabsContent value="availability">
                  <AvailabilityCalendar user={user} />
                </TabsContent>

                <TabsContent value="profile">
                  <ProfileSection user={user} onProfileUpdate={handleProfileUpdate} />
                </TabsContent>

                <TabsContent value="skills">
                  <SkillsSection user={user} />
                </TabsContent>

                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications</h2>
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('notifications')
                              .update({ is_read: true })
                              .eq('user_id', user.id)
                              .eq('is_read', false)

                            if (!error) {
                              setNotifications((notifications || []).map(n => ({ ...n, is_read: true })))
                              setUnreadCount(0)
                              toast({
                                title: "Success",
                                description: "All notifications marked as read",
                              })
                            }
                          }}
                          className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <NotificationsList 
                      notifications={notifications} 
                      onMarkAsRead={markNotificationAsRead} 
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

