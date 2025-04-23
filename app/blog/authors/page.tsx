'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import GradientText from '@/app/components/ui/GradientText';

// Mock authors data
const AUTHORS = [
  {
    id: 'pixel-dreamer',
    name: 'Pixel Dreamer',
    avatar: '/images/avatars/pixel-dreamer.jpg',
    role: 'Senior Editor',
    bio: 'Architectural designer by day, anime enthusiast by night. Explores the intersection of urban design and speculative fiction.',
    articles: 15,
    specialties: ['Cyberpunk', 'Architecture', 'Visual Analysis'],
    socialLinks: {
      twitter: 'https://twitter.com/pixeldreamer',
      instagram: 'https://instagram.com/pixel.dreamer'
    }
  },
  {
    id: 'cyber-otaku',
    name: 'Cyber Otaku',
    avatar: '/images/avatars/cyber-otaku.jpg',
    role: 'Philosophy Columnist',
    bio: 'PhD in Philosophy with a focus on transhumanism. Analyzes the philosophical underpinnings of sci-fi anime.',
    articles: 12,
    specialties: ['Philosophy', 'Ethics', 'Transhumanism'],
    socialLinks: {
      twitter: 'https://twitter.com/cyberotaku',
      instagram: 'https://instagram.com/cyber.otaku'
    }
  },
  {
    id: 'neon-writer',
    name: 'Neon Writer',
    avatar: '/images/avatars/neon-writer.jpg',
    role: 'History Specialist',
    bio: 'Animation historian tracking the evolution of anime styles and techniques from the 1960s to present day.',
    articles: 18,
    specialties: ['Anime History', 'Studio Evolution', 'Art Styles'],
    socialLinks: {
      twitter: 'https://twitter.com/neonwriter',
      instagram: 'https://instagram.com/neon.writer'
    }
  },
  {
    id: 'mecha-mind',
    name: 'Mecha Mind',
    avatar: '/images/avatars/mecha-mind.jpg',
    role: 'Technical Analyst',
    bio: 'Mechanical engineer fascinated by the technical designs in mecha anime. Breaks down the plausibility of giant robots.',
    articles: 9,
    specialties: ['Mecha', 'Engineering', 'Technical Analysis'],
    socialLinks: {
      twitter: 'https://twitter.com/mechamind',
      instagram: 'https://instagram.com/mecha.mind'
    }
  },
  {
    id: 'sakura-critica',
    name: 'Sakura Critica',
    avatar: '/images/avatars/sakura-critica.jpg',
    role: 'Lead Reviewer',
    bio: 'Professional critic with an eye for storytelling. Provides thoughtful analysis on narrative structure and character development.',
    articles: 24,
    specialties: ['Reviews', 'Narrative Analysis', 'Character Studies'],
    socialLinks: {
      twitter: 'https://twitter.com/sakuracritica',
      instagram: 'https://instagram.com/sakura.critica'
    }
  },
  {
    id: 'digital-sensei',
    name: 'Digital Sensei',
    avatar: '/images/avatars/digital-sensei.jpg',
    role: 'Industry Insider',
    bio: 'Former production assistant with connections throughout the anime industry. Provides insights on production processes and industry trends.',
    articles: 11,
    specialties: ['Industry News', 'Production', 'Studio Profiles'],
    socialLinks: {
      twitter: 'https://twitter.com/digitalsensei',
      instagram: 'https://instagram.com/digital.sensei'
    }
  }
];

export default function AuthorsPage() {
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
              Meet Our Authors
            </GradientText>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The passionate voices behind AnimeVerse's content. Our team brings diverse
              expertise and perspectives to the world of anime.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {AUTHORS.map(author => (
            <motion.div 
              key={author.id}
              variants={itemVariants}
            >
              <Link href={`/blog/authors/${author.id}`} className="block group">
                <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-pink-500/30 group-hover:border-pink-500/80 transition-colors">
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                        {author.name}
                      </h3>
                      <p className="text-pink-400">{author.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-5 line-clamp-3">
                    {author.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {author.specialties.map(specialty => (
                      <span 
                        key={specialty} 
                        className="px-2 py-1 text-xs rounded-full bg-gray-700/70"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                    <span className="text-gray-400 text-sm">
                      {author.articles} {author.articles === 1 ? 'article' : 'articles'}
                    </span>
                    <div className="flex text-cyan-400 font-medium">
                      View Profile
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
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Join Our Team Banner */}
        <motion.div 
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border border-pink-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-2 text-white">Become a Contributor</h3>
              <p className="text-gray-300">Have a passion for anime and love to write? Join our team of contributors and share your insights with our community.</p>
            </div>
            <Link 
              href="/contact" 
              className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors text-white font-medium"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}