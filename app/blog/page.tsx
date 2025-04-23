'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPosts } from '@/app/lib/blogServices';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

// Parallax background elements
const ParallaxBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/images/anime-pattern-bg.jpg')] bg-cover opacity-10"></div>
      
      {/* Animated particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Card hover component with spring animation
const HoverCard = ({ children, className = '' }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.4)",
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }}
      className={`h-full transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Animated button
const AnimatedButton = ({ children, className, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`btn-cinematic ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// Main Blog Component
export default function BlogListingPage() {
  // State
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'magazine', 'list'
  const [featuredPost, setFeaturedPost] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getAllPosts();
        // Only show published posts
        const publishedPosts = fetchedPosts.filter(post => post.published);
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
        
        // Set featured post (first post or most recent)
        if (publishedPosts.length > 0) {
          setFeaturedPost(publishedPosts[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog posts. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Filter posts based on active filter and search term
  useEffect(() => {
    let result = [...posts];
    
    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter(post => 
        post.categories && Array.isArray(post.categories) && 
        post.categories.includes(activeFilter)
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post => 
        (post.title && post.title.toLowerCase().includes(term)) || 
        (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
        (post.categories && Array.isArray(post.categories) && 
          post.categories.some(cat => cat && cat.toLowerCase().includes(term)))
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.publishedAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.publishedAt || 0);
        return dateB - dateA;
      });
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.publishedAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.publishedAt || 0);
        return dateA - dateB;
      });
    } else if (sortBy === 'a-z') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }
    
    setFilteredPosts(result);
  }, [posts, activeFilter, searchTerm, sortBy]);
  
  // Get all unique categories from posts
  const categories = [
    'all',
    ...new Set(
      posts
        .filter(post => post.categories && Array.isArray(post.categories))
        .flatMap(post => post.categories)
        .filter(category => category) // Filter out undefined/null categories
    )
  ];
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(d);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Scroll to top button visibility
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);
  
  // Loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If loading, show spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Featured post component
  const FeaturedPostBanner = () => {
    if (!featuredPost) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/50 to-transparent z-10"></div>
          <img
            src={featuredPost.coverImage?.startsWith('http') 
              ? featuredPost.coverImage 
              : '/images/placeholder.jpg'}
            alt={featuredPost.title || 'Featured post'}
            className="absolute inset-0 w-full h-full object-cover image-cinematic"
          />
        </div>
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-8 md:px-16">
            <div className="max-w-3xl">
              <div className="flex items-center mb-4">
                <div className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                  Featured
                </div>
                {featuredPost.categories && featuredPost.categories[0] && (
                  <div className="ml-3 px-4 py-1.5 bg-fuchsia-600 text-white text-sm font-semibold rounded-full">
                    {featuredPost.categories[0]}
                  </div>
                )}
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 cinematic-text">
                {featuredPost.title}
              </h2>
              
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={featuredPost.author?.image || '/images/avatars/default.jpg'}
                      alt={featuredPost.author?.name || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white/90">
                      {featuredPost.author?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-white/80 font-medium">
                  {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                </div>
              </div>
              
              <Link href={`/blog/${featuredPost.slug}`}>
                <AnimatedButton className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-xl shadow-xl hover:shadow-2xl font-medium">
                  Read Article
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Grid view card component
  const GridViewCard = ({ post, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="h-full"
      >
        <Link href={`/blog/${post.slug}`} className="block h-full">
          <HoverCard className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.coverImage?.startsWith('http') 
                  ? post.coverImage 
                  : '/images/placeholder.jpg'}
                alt={post.title || 'Blog post'}
                className="w-full h-full object-cover image-cinematic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {post.categories && post.categories[0] && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full category-badge">
                  {post.categories[0]}
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="text-xs text-indigo-300 mb-2">
                {formatDate(post.publishedAt || post.createdAt)}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-white/70 mb-4 line-clamp-3 text-sm">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                    <img
                      src={post.author?.image || '/images/avatars/default.jpg'}
                      alt={post.author?.name || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-white/80">
                      {post.author?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
                
                <span className="text-indigo-400 text-sm font-medium">
                  Read more →
                </span>
              </div>
            </div>
          </HoverCard>
        </Link>
      </motion.div>
    );
  };
  
  // Magazine view card component
  const MagazineViewCard = ({ post, index, isLarge = false }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`h-full ${isLarge ? 'col-span-2 row-span-2' : ''}`}
      >
        <Link href={`/blog/${post.slug}`} className="block h-full">
          <HoverCard className="relative h-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={post.coverImage?.startsWith('http') 
                  ? post.coverImage 
                  : '/images/placeholder.jpg'}
                alt={post.title || 'Blog post'}
                className="w-full h-full object-cover image-cinematic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-6">
              {post.categories && post.categories[0] && (
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full mb-3 category-badge">
                  {post.categories[0]}
                </div>
              )}
              
              <h3 className={`font-bold text-white mb-3 line-clamp-2 cinematic-text ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                {post.title}
              </h3>
              
              {isLarge && (
                <p className="text-white/80 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                    <img
                      src={post.author?.image || '/images/avatars/default.jpg'}
                      alt={post.author?.name || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-white/80">
                      {post.author?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-white/60">
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
              </div>
            </div>
          </HoverCard>
        </Link>
      </motion.div>
    );
  };
  
  // List view card component
  const ListViewCard = ({ post, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="w-full"
      >
        <Link href={`/blog/${post.slug}`}>
          <HoverCard className="flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <img
                src={post.coverImage?.startsWith('http') 
                  ? post.coverImage 
                  : '/images/placeholder.jpg'}
                alt={post.title || 'Blog post'}
                className="w-full h-full object-cover image-cinematic"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 md:bg-gradient-to-l"></div>
            </div>
            
            <div className="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories && Array.isArray(post.categories) && 
                    post.categories.slice(0, 3).map((category, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full category-badge"
                      >
                        {category}
                      </span>
                    ))
                  }
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {post.title}
                </h3>
                
                <p className="text-white/70 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                  {post.excerpt}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                      <img
                        src={post.author?.image || '/images/avatars/default.jpg'}
                        alt={post.author?.name || 'Author'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs font-medium text-white/80">
                        {post.author?.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                </div>
                
                <span className="text-indigo-400 text-sm font-medium">
                  Read more →
                </span>
              </div>
            </div>
          </HoverCard>
        </Link>
      </motion.div>
    );
  };
  
  // Sidebar component
  const Sidebar = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`lg:block ${sidebarOpen ? 'fixed inset-0 z-50 lg:relative' : 'hidden'}`}
      >
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        
        <div className={`w-72 lg:w-auto h-full bg-indigo-900/90 backdrop-blur-md p-6 overflow-y-auto rounded-xl border border-white/10 ${
          sidebarOpen ? 'fixed left-0 top-0 bottom-0 z-50 shadow-2xl lg:shadow-none lg:static' : ''
        }`}>
          {sidebarOpen && (
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveFilter(category);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeFilter === category
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-white/70 hover:bg-indigo-800/50 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Sort By</h3>
            <div className="space-y-2">
              {['newest', 'oldest', 'a-z', 'z-a'].map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSortBy(option);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    sortBy === option
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-white/70 hover:bg-indigo-800/50 hover:text-white'
                  }`}
                >
                  {option === 'a-z' ? 'Title (A-Z)' : 
                   option === 'z-a' ? 'Title (Z-A)' :
                   option === 'newest' ? 'Newest First' : 'Oldest First'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">View Mode</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-800/30 text-white/70 hover:bg-indigo-800/50 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('magazine')}
                className={`flex-1 px-3 py-2 rounded-lg ${
                  viewMode === 'magazine'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-800/30 text-white/70 hover:bg-indigo-800/50 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-800/30 text-white/70 hover:bg-indigo-800/50 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-indigo-800/30 text-white border border-indigo-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/50"
              />
              {searchTerm ? (
                <button
                  className="absolute right-3 top-2.5 text-white/50 hover:text-white"
                  onClick={() => setSearchTerm('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="absolute right-3 top-2.5 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ParallaxBackground />
      
      {/* Header Section */}
      <header className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6 cinematic-text"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                AnimeVerse
              </span>
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-white/80 max-w-2xl mt-6"
            >
              Explore our collection of articles, analyses, and insights about the magical world of anime
            </motion.p>
          </div>
          
          {/* Mobile Controls */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Filters
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-900/50 text-white/70'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('magazine')}
                className={`p-2 rounded-lg ${
                  viewMode === 'magazine'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-900/50 text-white/70'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-900/50 text-white/70'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="relative pb-24">
        <div className="container mx-auto px-4">
          {/* Featured post */}
          {!loading && !error && filteredPosts.length > 0 && <FeaturedPostBanner />}
          
          {/* Results info */}
          <div className="mb-8">
            <div className="font-medium text-lg text-white/80">
              Showing <span className="text-indigo-400 font-bold">{filteredPosts.length}</span> of <span className="text-indigo-400 font-bold">{posts.length}</span> posts
              {activeFilter !== 'all' && (
                <span> in <span className="text-pink-400 font-bold">"{activeFilter}"</span></span>
              )}
              {searchTerm && (
                <span> matching <span className="text-cyan-400 font-bold">"{searchTerm}"</span></span>
              )}
            </div>
          </div>
          
          {/* Main content layout with sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-72 shrink-0">
              <Sidebar />
            </div>
            
            {/* Content area */}
            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-24">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full mb-6"
                  ></motion.div>
                  <p className="text-xl text-white/80 mt-4">Loading amazing content...</p>
                </div>
              ) : error ? (
                <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-rose-500 mb-6">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h3>
                  <p className="text-white/70 mb-8">{error}</p>
                  <AnimatedButton 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </AnimatedButton>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-indigo-400 mb-6">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No posts found</h3>
                  <p className="text-white/70 mb-8">Try changing your search criteria or check back later!</p>
                  <AnimatedButton 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl"
                    onClick={() => {
                      setActiveFilter('all');
                      setSearchTerm('');
                    }}
                  >
                    Reset Filters
                  </AnimatedButton>
                </div>
              ) : (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.map((post, index) => (
                        <GridViewCard key={post.id || index} post={post} index={index} />
                      ))}
                    </div>
                  )}
                  
                  {/* Magazine View */}
                  {viewMode === 'magazine' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-min gap-6">
                      {filteredPosts.map((post, index) => {
                        // First post is large (spans 2 columns and rows)
                        if (index === 0) {
                          return (
                            <MagazineViewCard 
                              key={post.id || index} 
                              post={post} 
                              index={index}
                              isLarge={true}
                            />
                          );
                        }
                        return (
                          <MagazineViewCard key={post.id || index} post={post} index={index} />
                        );
                      })}
                    </div>
                  )}
                  
                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="space-y-6">
                      {filteredPosts.map((post, index) => (
                        <ListViewCard key={post.id || index} post={post} index={index} />
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* Pagination - show if there are more than 12 posts */}
              {!loading && !error && filteredPosts.length > 12 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-indigo-600 hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-medium">
                      1
                    </button>
                    
                    <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-indigo-600 hover:text-white transition">
                      2
                    </button>
                    
                    <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-indigo-600 hover:text-white transition">
                      3
                    </button>
                    
                    <span className="w-10 h-10 flex items-center justify-center text-white/70">...</span>
                    
                    <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-indigo-600 hover:text-white transition">
                      10
                    </button>
                    
                    <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-indigo-600 hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Newsletter section */}
          <div className="mt-24 relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
            <div className="absolute inset-0 opacity-30 mix-blend-soft-light" style={{ 
              backgroundImage: `url('/images/anime-pattern-bg.jpg')`,
              backgroundSize: 'cover'
            }}></div>
            
            <div className="relative px-8 py-16 md:px-16 text-center">
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-white mb-4 cinematic-text"
              >
                Stay Updated with Anime News
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
              >
                Subscribe to our newsletter and get the latest anime news, reviews, and insights delivered directly to your inbox.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                
                <AnimatedButton 
                  className="px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-xl shadow-xl sm:w-auto"
                >
                  <span className="flex items-center justify-center font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Subscribe</span>
                  </span>
                </AnimatedButton>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-white/60 mt-4"
              >
                We respect your privacy. Unsubscribe at any time.
              </motion.p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-12 relative border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                AnimeVerse
              </div>
              <p className="text-white/60 mt-2">Your gateway to the anime universe</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} AnimeVerse. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg z-50 hover:bg-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to get emoji for category
function getCategoryEmoji(category) {
  const categoryMap = {
    'architecture': '🏙️',
    'cyberpunk': '🤖',
    'visual-analysis': '👁️',
    'akira': '🏍️',
    'ghost-in-the-shell': '👻',
    'animation': '🎬',
    'action': '💥',
    'fight-scenes': '👊',
    'studio-ghibli': '🌱',
    'environmental-themes': '🌳',
    'miyazaki': '✨',
    'film-analysis': '🎞️',
    'isekai': '🌀',
    'genre-analysis': '📊',
    'anime-trends': '📈',
    'cultural-analysis': '🔍',
    'music': '🎵',
    'soundtracks': '🎼',
    'audio-analysis': '🔊',
    'composition': '🎹',
    'neo-tokyo': '🌃',
    'design': '✏️',
    'aesthetics': '🎨',
    'futurism': '🚀',
  };
  
  return categoryMap[category] || '📚';
}