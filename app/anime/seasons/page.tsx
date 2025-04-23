'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientText from '@/app/components/ui/GradientText';
import AnimeSeasonsGrid from '@/app/components/anime/AnimeSeasongrid';

// Mock seasons data
const CURRENT_YEAR = 2025;
const CURRENT_SEASON = 'Spring';

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];
const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];

const FEATURED_SEASONS = [
  {
    year: 2025,
    season: 'Winter',
    image: '/images/seasons/winter-2025.jpg',
    count: 42,
    isCurrent: false
  },
  {
    year: 2025,
    season: 'Spring',
    image: '/images/seasons/spring-2025.jpg',
    count: 38,
    isCurrent: true
  },
  {
    year: 2024,
    season: 'Fall',
    image: '/images/seasons/fall-2024.jpg',
    count: 45,
    isCurrent: false
  },
  {
    year: 2024,
    season: 'Summer',
    image: '/images/seasons/summer-2024.jpg',
    count: 50,
    isCurrent: false
  }
];

export default function SeasonsPage() {
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
              Anime Seasons
            </GradientText>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Browse anime by release season. Discover what's currently airing, 
              upcoming releases, and explore previous seasons' offerings.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Current Season Banner */}
        <section className="mb-16">
          <div className="relative rounded-xl overflow-hidden">
            <div className="relative aspect-video w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-purple-900/80 z-10"
              />
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Current season image would go here */}
                <div className="w-full h-full bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900" />
              </motion.div>
            </div>
            
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    {CURRENT_SEASON} {CURRENT_YEAR}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8">
                    Explore currently airing anime this season
                  </p>
                  <Link 
                    href={`/anime/seasons/${CURRENT_YEAR}/${CURRENT_SEASON.toLowerCase()}`}
                    className="px-6 py-3 bg-pink-600 hover:bg-pink-700 transition-colors text-white font-medium rounded-lg inline-flex items-center"
                  >
                    View Current Season
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="ml-2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recent Seasons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            Recent Seasons
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {FEATURED_SEASONS.map((season) => (
              <motion.div
                key={`${season.year}-${season.season}`}
                variants={itemVariants}
              >
                <Link 
                  href={`/anime/seasons/${season.year}/${season.season.toLowerCase()}`}
                  className="block group"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[2/1] mb-3">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
                    
                    {season.isCurrent && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-pink-600 text-white text-xs font-bold rounded-full z-10">
                        Current
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 z-10">
                      <h3 className="font-bold text-lg group-hover:text-pink-400 transition-colors">
                        {season.season} {season.year}
                      </h3>
                      <div className="text-sm text-gray-300">{season.count} anime</div>
                    </div>
                    
                    {/* This would be an actual image in production */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-purple-900 group-hover:scale-105 transition-transform duration-300"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Archive Browser */}
        <section>
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            Season Archive
          </h2>
          
          <div className="space-y-6">
            {YEARS.map(year => (
              <div key={year} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">{year}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {SEASONS.map(season => (
                    <Link 
                      key={`${year}-${season}`}
                      href={`/anime/seasons/${year}/${season.toLowerCase()}`}
                      className="block group"
                    >
                      <div className="p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all hover:bg-gray-800/50 text-center">
                        <span className="font-medium group-hover:text-cyan-400 transition-colors">
                          {season}
                        </span>
                        
                        {year === CURRENT_YEAR && season === CURRENT_SEASON && (
                          <div className="mt-1 text-xs text-pink-400 font-medium">Current</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Older Seasons Link */}
            <div className="text-center mt-8">
              <Link 
                href="/anime/seasons/archive" 
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                View older seasons
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="ml-2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}