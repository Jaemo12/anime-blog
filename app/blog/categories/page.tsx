'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientText from '@/app/components/ui/GradientText';

// Mock categories with additional data
const CATEGORIES = [
  { 
    id: 'analysis', 
    name: 'Analysis', 
    count: 12,
    description: 'Deep dives into anime themes, symbolism, and cultural significance.',
    featured: true
  },
  { 
    id: 'reviews', 
    name: 'Reviews', 
    count: 28,
    description: 'Honest critiques and recommendations for anime series and films.',
    featured: true
  },
  { 
    id: 'interviews', 
    name: 'Interviews', 
    count: 5,
    description: 'Conversations with creators, voice actors, and industry professionals.',
    featured: false
  },
  { 
    id: 'philosophy', 
    name: 'Philosophy', 
    count: 9,
    description: 'Exploring the philosophical concepts and questions raised in anime.',
    featured: true
  },
  { 
    id: 'history', 
    name: 'History', 
    count: 15,
    description: 'Tracing the evolution of anime genres, studios, and cultural impact.',
    featured: false
  },
  { 
    id: 'tutorials', 
    name: 'Tutorials', 
    count: 7,
    description: 'Guides for aspiring anime creators, cosplayers, and enthusiasts.',
    featured: false
  },
  { 
    id: 'news', 
    name: 'News', 
    count: 31,
    description: 'Latest updates from the anime industry and upcoming releases.',
    featured: true
  },
  { 
    id: 'opinion', 
    name: 'Opinion', 
    count: 18,
    description: 'Personal perspectives on anime trends, controversies, and fandom.',
    featured: false
  },
  { 
    id: 'culture', 
    name: 'Culture', 
    count: 14,
    description: 'Exploring how anime reflects and influences global culture.',
    featured: false
  },
];

export default function CategoriesPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Separate featured categories
  const featuredCategories = CATEGORIES.filter(cat => cat.featured);
  const regularCategories = CATEGORIES.filter(cat => !cat.featured);

  return (
    <main className="bg-gray-900 text-white min-h-screen pt-24 pb-20">
      {/* Page Header */}
      <header className="relative py-16 mb-10 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-gray-900"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <GradientText
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-4"
              from="cyan-400"
              to="pink-500"
            >
              Blog Categories
            </GradientText>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our content organized by topics. From in-depth analysis to the latest
              industry news, find exactly what interests you.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            Featured Categories
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredCategories.map(category => (
              <motion.div 
                key={category.id}
                variants={itemVariants}
              >
                <Link 
                  href={`/blog/categories/${category.id}`}
                  className="block group"
                >
                  <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/80 to-purple-900/40 backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-700/70">
                        {category.count} posts
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-pink-400 font-medium">
                      Browse {category.name}
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* All Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            All Categories
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {CATEGORIES.map(category => (
              <motion.div 
                key={category.id}
                variants={itemVariants}
              >
                <Link 
                  href={`/blog/categories/${category.id}`}
                  className="block group"
                >
                  <div className="p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all hover:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium group-hover:text-cyan-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {category.count}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}