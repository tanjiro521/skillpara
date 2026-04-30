"use client"

import { motion } from "framer-motion"
import { RefreshCw, Coins, IndianRupee } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <RefreshCw className="h-8 w-8 text-emerald-500" />,
      title: "Skill Swap",
      description: "Exchange your skills with others without paying",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-100 dark:border-emerald-800",
    },
    {
      icon: <Coins className="h-8 w-8 text-amber-500" />,
      title: "Tokens",
      description: "Earn tokens by teaching and use them to learn",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-100 dark:border-amber-800",
    },
    {
      icon: <IndianRupee className="h-8 w-8 text-blue-500" />,
      title: "Paid",
      description: "Pay directly when no swap is available",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-100 dark:border-blue-800",
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive bg-clip-text text-transparent">
            How SkillPara Works
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-maroon to-olive dark:from-maroon dark:to-olive mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border ${step.borderColor} text-center`}
            >
              <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-6 ${step.bgColor}`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

