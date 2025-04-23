'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GradientText from '@/app/components/ui/GradientText';

// Mock studios data
const STUDIOS = [
  {
    id: 'future-vision',
    name: 'Future Vision',
    logo: '/images/studios/future-vision.png',
    established: 2015,
    animeCount: 28,
    featured: true,
    description: 'Known for cutting-edge animation techniques and cyberpunk aesthetics. Their works often explore the relationship between humanity and technology.',
    notable: ['Neon Nexus', 'Digital Frontiers', 'Quantum Knights']
  },
  {
    id: 'temporal-arts',
    name: 'Temporal Arts',
    logo: '/images/studios/temporal-arts.png',
    established: 2008,
    animeCount: 42,
    featured: true,
    description: 'Specializes in historical fantasy and time travel narratives with meticulous attention to period details and fluid action sequences.',
    notable: ['Chrono Samurai', 'Edo Shadows', 'Timekeeper Chronicles']
  },
  {
    id: 'dream-canvas',
    name: 'Dream Canvas',
    logo: '/images/studios/dream-canvas.png',
    established: 2012,
    animeCount: 35,
    featured: true,
    description: 'Creates visually stunning works with dreamlike imagery and emotionally resonant storytelling, often focusing on psychological themes.',
    notable: ['Ethereal Garden', 'Memory Labyrinth', 'Lucid World']
  },
  {
    id: 'steel-vision',
    name: 'Steel Vision',
    logo: '/images/studios/steel-vision.png',
    established: 2005,
    animeCount: 54,
    featured: true,
    description: 'Renowned for mecha designs and detailed mechanical animation. Their productions feature complex political narratives and military themes.',
    notable: ['Mecha Odyssey', 'Steel Battalion', 'Orbital Command']
  },
  {
    id: 'nexus-network',
    name: 'Nexus Network',
    logo: '/images/studios/nexus-network.png',
    established: 2018,
    animeCount: 17,
    featured: false,
    description: 'A newer studio focusing on virtual reality settings and digital world narratives with bright color palettes and innovative interface designs.',
    notable: ['Digital Dreamers', 'Network Dive', 'Augmented']
  },
  {
    id: 'epic-realms',
    name: 'Epic Realms',
    logo: '/images/studios/epic-realms.png',
    established: 2010,
    animeCount: 38,
    featured: false,
    description: 'Creates grand fantasy epics with expansive worldbuilding, elaborate creature designs, and orchestral soundtracks.',
    notable: ['Kingdom of Scales', 'Mythic Quest', 'Elemental Lords']
  },
  {
    id: 'mystery-box',
    name: 'Mystery Box',
    logo: '/images/studios/mystery-box.png',
    established: 2011,
    animeCount: 25,
    featured: false,
    description: 'Specializes in intricate mysteries and psychological thrillers with unexpected plot twists and atmospheric tension.',
    notable: ['Academy of Shadows', 'Silent Whispers', 'Puzzle Room']
  },
  {
    id: 'cosmic-canvas',
    name: 'Cosmic Canvas',
    logo: '/images/studios/cosmic-canvas.png',
    established: 2009,
    animeCount: 32,
    featured: false,
    description: 'Known for space operas and science fiction with spectacular cosmic vistas, alien designs, and themes of exploration.',
    notable: ['Starlight Hunters', 'Orbital Academy', 'Void Explorers']
  },
  {
    id: 'dark-frame',
    name: 'Dark Frame',
    logo: '/images/studios/dark-frame.png',
    established: 2013,
    animeCount: 21,
    featured: false,
    description: 'Creates horror and suspense anime with distinctive shadow play, unsettling imagery, and psychological depth.',
    notable: ['Silent Whispers', 'Midnight Gallery', 'Haunted Memory']
  },
  {
    id: 'spirit-tales',
    name: 'Spirit Tales',
    logo: '/images/studios/spirit-tales.png',
    established: 2014,
    animeCount: 24,
    featured: false,
    description: 'Focuses on supernatural stories rooted in folklore and mythology with a traditional art style and atmospheric storytelling.',
    notable: ['Yokai Chronicles', 'Spirit Catcher', 'Divine Mountain']
  }
];

export default function StudiosPage() {
  // Separate featured and other studios
  const featuredStudios = STUDIOS.filter(studio => studio.featured);
  const otherStudios = STUDIOS.filter(studio => !studio.featured);
  
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
              Anime Studios
            </GradientText>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore the creative powerhouses behind your favorite anime.
              Learn about each studio's unique style, history, and notable works.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Featured Studios */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            Featured Studios
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredStudios.map(studio => (
              <motion.div 
                key={studio.id}
                variants={itemVariants}
              >
                <Link 
                  href={`/anime/studios/${studio.id}`}
                  className="block group"
                >
                  <div className="flex bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 transition-all p-6 rounded-xl hover:shadow-lg hover:shadow-pink-500/10">
                    <div className="w-16 h-16 relative flex-shrink-0 mr-4 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      {/* This would be an actual logo in production */}
                      <div className="text-xl font-bold text-center text-pink-400">
                        {studio.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">
                          {studio.name}
                        </h3>
                        <div className="text-sm text-gray-400">
                          Est. {studio.established}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        {studio.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="text-sm font-medium text-cyan-400">Notable Works:</div>
                        {studio.notable.map((title, index) => (
                          <React.Fragment key={title}>
                            <span className="text-sm text-gray-300">{title}</span>
                            {index < studio.notable.length - 1 && (
                              <span className="text-gray-600">•</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-400">
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="mr-1"
                        >
                          <path d="M2 12h6M2 12a10 10 0 0 1 10-10M2 12a10 10 0 0 0 10 10M12 2a2 2 0 0 1 2 2M12 2v4M12 22v-4M22 12h-6M22 12a10 10 0 0 0-10-10M22 12a10 10 0 0 1-10 10M12 2a2 2 0 0 0-2 2" />
                        </svg>
                        {studio.animeCount} anime productions
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* All Studios */}
        <section>
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-800">
            All Studios
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {STUDIOS.map(studio => (
              <motion.div 
                key={studio.id}
                variants={itemVariants}
              >
                <Link 
                  href={`/anime/studios/${studio.id}`}
                  className="block group"
                >
                  <div className="p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all hover:bg-gray-800/50">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 relative flex-shrink-0 mr-3 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                        {/* This would be an actual logo in production */}
                        <div className="text-sm font-bold text-center text-cyan-400">
                          {studio.name.charAt(0)}
                        </div>
                      </div>
                      
                      <h3 className="font-medium group-hover:text-cyan-400 transition-colors">
                        {studio.name}
                      </h3>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Est. {studio.established}</span>
                      <span>{studio.animeCount} anime</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Studio Insights */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-gray-800/50 to-purple-900/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Studio Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/70 rounded-lg p-5">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{STUDIOS.length}+</div>
                <div className="text-gray-300">Active Studios</div>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-5">
                <div className="text-3xl font-bold text-pink-400 mb-2">300+</div>
                <div className="text-gray-300">Anime Productions</div>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-5">
                <div className="text-3xl font-bold text-purple-400 mb-2">2005</div>
                <div className="text-gray-300">Oldest Studio Founded</div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-300">
                Each anime studio brings its unique artistic vision, animation techniques, and storytelling approaches to their productions. Explore each studio's page to discover their creative philosophy and complete works.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}