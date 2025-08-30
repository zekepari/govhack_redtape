"use client";

import {
  Building2,
  GraduationCap,
  Home as HomeIcon,
  Plane,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const contextCards = [
  {
    id: "business",
    title: "Business",
    description: "Navigate ABN, permits, Fair Work, and state regulations",
    icon: Building2,
  },
  {
    id: "student",
    title: "Student",
    description: "Visa requirements, work rights, and education compliance",
    icon: GraduationCap,
  },
  {
    id: "housing",
    title: "Housing",
    description:
      "First home buyer schemes, rental laws, and property regulations",
    icon: HomeIcon,
  },
  {
    id: "travel",
    title: "Travel",
    description: "Visa applications, customs, and travel requirements",
    icon: Plane,
  },
  {
    id: "corporate",
    title: "Corporate",
    description: "Enterprise compliance mapping and gap analysis",
    icon: Briefcase,
  },
  {
    id: "general",
    title: "General Help",
    description: "Not sure? Start here for general compliance guidance",
    icon: Sparkles,
  },
];

export function ContextSelection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-black mb-2">
          I need help with...
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {contextCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 * index,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -2, 2, -2, 0],
                  transition: { rotate: { duration: 0.3 } },
                }}
                whileTap={{ scale: 0.95 }}
                className=""
              >
                <Link href="/dashboard">
                  <motion.div
                    className="relative group cursor-pointer h-full"
                    whileHover={{ z: 50 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-500/60 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative bg-base-100 border-2 border-red-500/20 rounded-2xl p-6 h-full overflow-hidden group-hover:border-red-500 group-hover:shadow-lg transition-all duration-300">
                      {/* Animated Background */}
                      <motion.div
                        className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"
                        animate={{
                          x: [0, 10, 0],
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="inline-block mb-3">
                          <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                            <Icon className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
                          </div>
                        </div>

                        <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-base-content/60 line-clamp-2 flex-1">
                          {card.description}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Get started
                          </span>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            <ArrowRight className="w-4 h-4 text-red-500" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-8 text-center"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 group shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Skip to AI chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
