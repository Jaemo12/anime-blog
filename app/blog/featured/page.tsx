'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import GradientText from '@/app/components/ui/GradientText';
import BlogPostCard from '@/app/components/blog/BlogPostCard';

// Mock featured posts with more data
const FEATURED_POSTS = [
  {
    id: 'neo-tokyo-analysis',
    title: 'Neo-Tokyo: Architectural Elements in Cyberpunk Anime',
    excerpt: 'Exploring the distinctive visual language of futuristic cities in classic and modern cyberpunk anime series.',
    cover: '/images/neo-tokyo.jpg',
    publishedAt: '2025-04-08',
    author: {
      name: 'Pixel Dreamer',
      avatar: '/images/avatars/pixel-dreamer.jpg'
    },
    category: 'Analysis',
    readTime: 8,
    isFeatured: true,
    tags: ['cyberpunk', 'architecture', 'neo-tokyo']
  },
  {
    id: 'digital-souls',
    title: 'Digital Souls: Identity in Ghost in the Shell',
    excerpt: 'A deep dive into how Ghost in the Shell explores consciousness, identity and the human condition.',
    cover: '/images/digital-souls.jpg',
    publishedAt: '2025-04-05',
    author: {
      name: 'Cyber Otaku',
      avatar: '/images/avatars/cyber-otaku.jpg'
    },
    category: 'Philosophy',
    readTime: 12,
    isFeatured: true,
    tags: ['ghost in the shell', 'philosophy', 'identity']
  },
  {
    id: 'retro-future',
    title: 'Retro-Future: Aesthetic Evolution in Anime',
    excerpt: 'How anime has shaped and reshaped our vision of the future through decades of visual storytelling.',
    cover: '/images/retro-future.jpg',
    publishedAt: '2025-04-02',
    author: {
      name: 'Neon Writer',
      avatar: '/images/avatars/neon-writer.jpg'
    },
    category: 'History',
    readTime: 10,
    isFeatured: true,
    tags: ['history', 'aesthetics', 'futurism']
  },
  {
    id: 'mecha-evolution',
    title: 'The Evolution of Mecha Design in Anime',
    excerpt: 'From Tetsujin 28-go to modern series, how mechanical design in anime has evolved technically and thematically.',
    cover: '/images/mecha-evolution.jpg',
    publishedAt: '2025-03-27',
    author: {
      name: 'Mecha Mind',
      avatar: '/images/avatars/mecha-mind.jpg'
    },
    category: 'Analysis',
    readTime: 15,
    isFeatured: true,
    tags: ['mecha', 'design', 'gundam']
  },
  {
    id: 'voice-acting-legacy',
    title: 'The Art and Legacy of Anime Voice Acting',
    excerpt: 'How voice actors bring characters to life and shape the emotional impact of anime storytelling.',
    cover: '/images/voice-acting.jpg',
    publishedAt: '2025-03-20',
    author: {
      name: 'Digital Sensei',
      avatar: '/images/avatars/digital-sensei.jpg'
    },
    category: 'Industry',
    readTime: 9,
    isFeatured: true,
    tags: ['voice acting', 'seiyuu', 'production']
  },
  {
    id: 'anime-soundtrack-analysis',
    title: 'The Emotional Language of Anime Soundtracks',
    excerpt: 'How composers use music to enhance storytelling and create iconic moments in anime.',
    cover: '/images/anime-soundtrack.jpg',
    publishedAt: '2025-03-15',
    author: {
      name: 'Sakura Critica',
      avatar: '/images/avatars/sakura-critica.jpg'
    },
    category: 'Analysis',
    readTime: 11,
    isFeatured: true,
    tags: ['music', 'soundtrack', 'composition']
  }
];

export default function FeaturedBlogPage() {
  const latestFeatured = FEATURED_POSTS[0]; // The most recent featured post
  const otherFeatured = FEATURED_POSTS.slice(1); // All other featured posts
  
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
            <span className="inline-block px-3 py-1 text-xs border border-pink-500 text-pink-300 rounded-full bg-pink-900/30 backdrop-blur-md mb-4">
              EDITOR'S PICKS
            </span>
            <GradientText
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-4"
              from="cyan-400"
              to="pink-500"
            >
              Featured Articles
            </GradientText>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our most insightful and thought-provoking content, curated by our editorial team.
              Deep dives into the cultural significance, artistic innovation, and philosophical themes of anime.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Latest Featured Post (Hero) */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href={`/blog/${latestFeatured.id}`} className="block group">
              <div className="relative rounded-xl overflow-hidden">
                <div className="relative aspect-[21/9] w-full">
                  <Image
                    src={latestFeatured.cover}
                    alt={latestFeatured.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-block px-3 py-1 text-sm border border-pink-500 text-pink-300 rounded-full bg-pink-900/30 backdrop-blur-md mb-4">
                    {latestFeatured.category}
                  </span>
                  
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-pink-400 transition-colors">
                    {latestFeatured.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-6 max-w-3xl">
                    {latestFeatured.excerpt}
                  </p>
                  
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={latestFeatured.author.avatar}
                        alt={latestFeatured.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{latestFeatured.author.name}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(latestFeatured.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} • {latestFeatured.readTime} min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
        
        {/* Other Featured Posts */}
        <section>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {otherFeatured.map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <BlogPostCard 
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  cover={post.cover}
                  publishedAt={post.publishedAt}
                  author={post.author}
                  category={post.category}
                  readTime={post.readTime}
                  variant="featured"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}