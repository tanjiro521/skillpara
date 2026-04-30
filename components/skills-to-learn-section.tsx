"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2, BookOpen, Search, Target } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const learningCategories = [
  "Education",
  "Technology",
  "Home & Garden",
  "Arts & Crafts",
  "Fitness & Health",
  "Cooking",
  "Music",
  "Languages",
  "Business",
  "Photography",
  "Writing",
  "Design",
]

type LearningSkill = {
  id: string
  user_id: string
  skill_name: string
  category: string
  description: string
  intent: string
  created_at: string
}

type SkillsToLearnSectionProps = {
  user: any
}

export function SkillsToLearnSection({ user }: SkillsToLearnSectionProps) {
  const [learningSkills, setLearningSkills] = useState<LearningSkill[]>([])
  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    category: "",
    description: "",
  })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user?.id) {
      fetchLearningSkills(user.id)
    }
  }, [user])

  const fetchLearningSkills = async (userId: string) => {
    setLoading(true)
    try {
      console.log("Fetching learning skills for user:", userId)
      
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .eq('intent', 'seeker')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching learning skills:", error)
        throw error
      }

      console.log("Fetched learning skills:", data)
      setLearningSkills(data || [])
    } catch (error: any) {
      console.error("Error fetching learning skills:", error)
      toast({
        title: "Error",
        description: "Failed to load skills you want to learn.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddLearningSkill = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newSkill.skill_name || !newSkill.category || !user?.id) {
      toast({
        title: "Error",
        description: "Please fill in skill name and category.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const skillData = {
        user_id: user.id,
        skill_name: newSkill.skill_name,
        category: newSkill.category,
        description: newSkill.description,
        intent: 'seeker' // Mark as seeking to learn
      }
      
      const { data, error } = await supabase
        .from('skills')
        .insert([skillData])
        .select()
        
      if (error) throw error

      if (data && data.length > 0) {
        setLearningSkills([data[0], ...learningSkills])
      }

      setNewSkill({
        skill_name: "",
        category: "",
        description: "",
      })

      setIsAddingSkill(false)

      toast({
        title: "Skill added",
        description: `You're now looking to learn "${data[0].skill_name}".`,
      })
    } catch (error: any) {
      console.error("Error adding learning skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add skill to learn.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId)
        .eq('user_id', user.id)
        
      if (error) throw error
      
      setLearningSkills(learningSkills.filter((skill) => skill.id !== skillId))

      toast({
        title: "Skill removed",
        description: "You've removed this skill from your learning list.",
      })
    } catch (error: any) {
      console.error("Error deleting learning skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove skill.",
        variant: "destructive",
      })
    }
  }

  const filteredSkills = learningSkills.filter(skill =>
    skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Skills I Want to Learn</h2>
        </div>
        <Button
          onClick={() => setIsAddingSkill(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isAddingSkill}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill to Learn
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search your learning list..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Learning Skills List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No skills to learn yet</h3>
            <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
              Add skills you want to learn from the community. Providers offering these skills will be able to find you!
            </p>
            <Button 
              onClick={() => setIsAddingSkill(true)} 
              className="mt-4"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredSkills.map((skill) => (
            <motion.div key={skill.id} variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{skill.skill_name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {skill.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {skill.description && (
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Added {new Date(skill.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Add Skill to Learn
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLearningSkill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learn_skill_name">What do you want to learn?</Label>
              <Input
                id="learn_skill_name"
                value={newSkill.skill_name}
                onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                placeholder="e.g., Python Programming, Guitar, Photography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learn_category">Category</Label>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {learningCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learn_description">Description (optional)</Label>
              <Input
                id="learn_description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                placeholder="Any specific area or goal..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingSkill(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add to Learning List"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}