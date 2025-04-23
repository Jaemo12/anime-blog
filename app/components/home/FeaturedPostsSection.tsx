'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientText from '../ui/GradientText';
import Button from '../ui/Button';
import BlogPostCard from '../blog/BlogPostCard';
import { getFeaturedPosts } from '@/app/lib/blogServices';

// Types for blog post
interface Author {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  publishedAt: string;
  author: Author;
  category: string;
  readTime: number;
  slug: string;
}

// Fallback data in case Firebase fetch fails
const FALLBACK_POSTS = [
  {
    id: 'neo-tokyo-analysis',
    title: 'Neo-Tokyo: Architectural Elements in Cyberpunk Anime',
    excerpt: 'Exploring the distinctive visual language of futuristic cities in classic and modern cyberpunk anime series.',
    cover: '/images/neo-tokyo.jpg',
    publishedAt: '2025-04-08',
    author: {
      name: 'Pixel Dreamer',
      avatar: '/images/avatars/default.jpg'
    },
    category: 'Analysis',
    readTime: 8,
    slug: 'neo-tokyo-analysis'
  },
  {
    id: 'digital-souls',
    title: 'Digital Souls: Identity in Ghost in the Shell',
    excerpt: 'A deep dive into how Ghost in the Shell explores consciousness, identity and the human condition.',
    cover: '/images/digital-souls.jpg',
    publishedAt: '2025-04-05',
    author: {
      name: 'Cyber Otaku',
      avatar: '/images/avatars/default.jpg'
    },
    category: 'Philosophy',
    readTime: 12,
    slug: 'digital-souls'
  },
  {
    id: 'retro-future',
    title: 'Retro-Future: Aesthetic Evolution in Anime',
    excerpt: 'How anime has shaped and reshaped our vision of the future through decades of visual storytelling.',
    cover: '/images/retro-future.jpg',
    publishedAt: '2025-04-02',
    author: {
      name: 'Neon Writer',
      avatar: '/images/avatars/default.jpg'
    },
    category: 'History',
    readTime: 10,
    slug: 'retro-future'
  }
];

const FeaturedSection: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation variants with spring physics
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.7
      }
    }
  };

  // Helper function to validate image URL
  const validateImageUrl = (url: string): string => {
    // Check if the URL is valid or provide a fallback
    if (!url || url === 'asd' || !url.startsWith('/') && !url.startsWith('http')) {
      return '/images/placeholders/post-placeholder.jpg'; // Use a placeholder
    }
    return url;
  };

  // Helper function to calculate estimated read time
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1; // Minimum 1 minute read time
  };

  // Fetch featured posts from Firebase
  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        setLoading(true);
        // Get posts marked as featured from Firebase
        const posts = await getFeaturedPosts();
        
        if (posts.length === 0) {
          // If no posts found, use fallback data
          setFeaturedPosts(FALLBACK_POSTS);
        } else {
          // Map the Firebase data to our component format
          const formattedPosts = posts.map(post => ({
            id: post.id || 'fallback-id-' + Math.random().toString(36).substr(2, 9),
            title: post.title || 'Untitled Post',
            excerpt: post.excerpt || 'No excerpt available.',
            cover: validateImageUrl(post.coverImage),
            publishedAt: post.createdAt ? new Date(post.createdAt.toDate()).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            author: {
              name: post.author?.name || 'Anonymous Author',
              avatar: validateImageUrl(post.author?.image || '/images/avatars/default.jpg')
            },
            category: post.categories && post.categories.length > 0 ? post.categories[0] : 'Uncategorized',
            readTime: calculateReadTime(post.content),
            slug: post.slug || 'untitled-post'
          }));
          
          setFeaturedPosts(formattedPosts);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching featured posts:', err);
        setError('Failed to load featured posts');
        // Use fallback data in case of error
        setFeaturedPosts(FALLBACK_POSTS);
        setLoading(false);
      }
    };
    
    loadFeaturedPosts();
  }, []);

  // Render loading skeleton
  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="w-32 h-8 bg-indigo-100 rounded-full animate-pulse mb-4"></div>
              <div className="w-64 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-xl h-full overflow-hidden shadow-xl">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="w-full h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between mt-6">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      {/* Solid-color decorative element instead of problematic gradient borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
      
      {/* Simplified background with solid colors instead of gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 opacity-30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-700 rounded-full bg-indigo-100 shadow-sm mb-4"
            >
              FEATURED READS
            </motion.div>
            
            <GradientText
              as="h2"
              className="text-3xl md:text-5xl font-bold tracking-tight"
              from="indigo-600"
              to="fuchsia-600"
            >
              Top Stories
            </GradientText>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 md:mt-0"
          >
            <Button 
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-700 border-0 shadow-lg px-6 py-2.5 rounded-full text-white font-medium group"
              href="/blog/featured"
            >
              <span>Explore All Featured</span>
              <motion.svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="ml-2 group-hover:translate-x-1 transition-transform"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </Button>
          </motion.div>
        </motion.div>

        {/* Blog post cards grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {featuredPosts.map((post) => (
            <motion.div 
              key={post.id} 
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 10 }
              }}
              className="h-full"
            >
              <div className="bg-white rounded-xl h-full overflow-hidden shadow-xl">
                <BlogPostCard 
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  cover={validateImageUrl(post.cover)}
                  publishedAt={post.publishedAt}
                  author={{
                    name: post.author.name,
                    avatar: validateImageUrl(post.author.avatar)
                  }}
                  category={post.category}
                  readTime={post.readTime}
                  variant="featured"
                  slug={post.slug}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;