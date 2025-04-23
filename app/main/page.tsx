'use client';
import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import TrendingSection from '../components/home/TrendingSection';
import FeaturedPostsSection from '../components/home/FeaturedPostsSection';
import Newsletter from '../components/ui/NewsLetter';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePage() {
   // Add loading state
   const [isLoading, setIsLoading] = useState(true);
  
   // Simulate loading and then hide the spinner
   useEffect(() => {
     // Make sure we're in the browser environment
     if (typeof window !== 'undefined') {
       const timer = setTimeout(() => {
         setIsLoading(false);
       }, 3000); // Show loading spinner for 3 seconds
       
       return () => clearTimeout(timer);
     }
   }, []);
   
   // Return loading spinner while loading, otherwise return the main content
   if (isLoading) {
     return <LoadingSpinner />;
   }
 
  return (
    <main className="bg-gradient-to-b from-blue-50 via-green-50 to-blue-100 text-slate-800 min-h-screen">
      {/* Admin Panel Link - Quick access with pastel colors */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link 
          href="/admin/posts" 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-green-300 hover:from-blue-400 hover:to-green-400 text-white px-5 py-3 rounded-xl shadow-lg shadow-blue-200/50 transition-all duration-300 group"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:rotate-12 transition-transform"
          >
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
          </svg>
          <span className="font-medium">Create Post</span>
        </Link>
      </div>
      
      {/* Main Hero Section */}
      <HeroSection />
      
      {/* Trending Anime Section with pastel theme */}
      <section className="py-24 relative overflow-hidden bg-white/70">
        {/* Soft decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent z-10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-green-200/20 blur-3xl"></div>
        
        {/* Soft pattern */}
        <div className="absolute inset-0 bg-[url('/pattern-light.svg')] bg-repeat opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <div className="inline-block mx-auto">
              <span className="block bg-gradient-to-r from-green-200 to-blue-200 h-1 w-20 mx-auto mt-6 rounded-full"></span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg mt-6">
              Stay up to date with the most popular anime series of the current season, as voted by our community.
            </p>
          </motion.div>
          
          <TrendingSection />
          
          {/* View more button */}
          <div className="text-center mt-10">
            <Link href="/anime/trending" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-blue-500 font-medium px-6 py-3 rounded-full border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
              <span>View More Trending Anime</span>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Decorated divider */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-blue-50"></div>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-blue-200"></div>
            <div className="text-3xl text-blue-300">✿</div>
            <div className="text-3xl text-green-300">❀</div>
            <div className="text-3xl text-blue-300">✿</div>
            <div className="h-[2px] w-20 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Featured Posts Section with pastel theme */}
      <section className="py-24 relative overflow-hidden bg-blue-50">
        {/* Soft decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/30 to-transparent z-10"></div>
        <div className="absolute -top-10 left-1/4 w-72 h-72 rounded-full bg-green-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <div className="inline-block mx-auto">
              <span className="block bg-gradient-to-r from-green-200 to-blue-200 h-1 w-20 mx-auto mb-6 rounded-full"></span>
              <h2 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 text-4xl md:text-5xl font-bold mb-6">
                Latest Articles
              </h2>
              <span className="block bg-gradient-to-r from-blue-200 to-green-200 h-1 w-20 mx-auto mt-6 rounded-full"></span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg mt-6">
              Deep dives into anime series, character analyses, and thought-provoking discussions.
            </p>
          </motion.div>
          
          <FeaturedPostsSection />
          
          {/* View more button */}
          <div className="text-center mt-10">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-green-500 font-medium px-6 py-3 rounded-full border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
              <span>View All Articles</span>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Decorated divider */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-green-50"></div>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-blue-200"></div>
            <div className="text-3xl text-green-300">✿</div>
            <div className="text-3xl text-blue-300">❀</div>
            <div className="text-3xl text-green-300">✿</div>
            <div className="h-[2px] w-20 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Explore Categories Section with pastel theme */}
      <section className="py-24 relative overflow-hidden bg-green-50">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50/40"></div>
          <div className="absolute inset-0 bg-[url('/pattern-light.svg')] bg-repeat opacity-5"></div>
        </div>
        
        {/* Animated dots or particles */}
        <div className="absolute inset-0 -z-5 opacity-20">
          <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>
          <div className="absolute top-40 right-40 w-2 h-2 rounded-full bg-green-300 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-60 left-1/3 w-2 h-2 rounded-full bg-teal-300 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <div className="inline-block mx-auto">
              <span className="block bg-gradient-to-r from-green-200 to-blue-200 h-1 w-20 mx-auto mb-6 rounded-full"></span>
              <h2 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-400 to-blue-400 text-4xl md:text-5xl font-bold mb-6">
                Explore AnimeVerse
              </h2>
              <span className="block bg-gradient-to-r from-blue-200 to-green-200 h-1 w-20 mx-auto mt-6 rounded-full"></span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg mt-6">
              Discover all the different ways to experience anime content on our platform.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/anime/genres" className="block group h-full">
                <div className="bg-white backdrop-blur-md border border-slate-100 hover:border-blue-200 transition-all duration-300 rounded-2xl p-8 h-full hover:transform hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-500">
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-blue-500 group-hover:text-blue-600 transition-colors"
                    >
                      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                      <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                      <path d="M19 11h2m-1 -1v2" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-700 group-hover:text-blue-500 transition-colors">Anime Genres</h3>
                  <p className="text-slate-600 mb-4">
                    Explore anime by genre from action-packed adventures to thought-provoking psychological thrillers.
                  </p>
                  
                  <div className="flex items-center text-blue-500 font-medium">
                    Browse Genres
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
            
            <motion.div variants={fadeInUp}>
              <Link href="/blog/categories" className="block group h-full">
                <div className="bg-white backdrop-blur-md border border-slate-100 hover:border-green-200 transition-all duration-300 rounded-2xl p-8 h-full hover:transform hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-green-300 transition-all duration-500">
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-green-500 group-hover:text-green-600 transition-colors"
                    >
                      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                      <path d="M8 9h1" />
                      <path d="M15 9h1" />
                      <path d="M9 15h6" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-700 group-hover:text-green-500 transition-colors">Blog Categories</h3>
                  <p className="text-slate-600 mb-4">
                    Discover in-depth articles, reviews, analysis, and interviews about your favorite anime.
                  </p>
                  
                  <div className="flex items-center text-green-500 font-medium">
                    Read Articles
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
            
            <motion.div variants={fadeInUp}>
              <Link href="/admin/posts" className="block group h-full">
                <div className="bg-white backdrop-blur-md border border-slate-100 hover:border-teal-200 transition-all duration-300 rounded-2xl p-8 h-full hover:transform hover:translate-y-[-8px] hover:shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-500">
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-teal-500 group-hover:text-teal-600 transition-colors"
                    >
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-700 group-hover:text-teal-500 transition-colors">Create Content</h3>
                  <p className="text-slate-600 mb-4">
                    Share your thoughts and insights by writing new blog posts for the AnimeVerse community.
                  </p>
                  
                  <div className="flex items-center text-teal-500 font-medium">
                    Write New Post
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
          </motion.div>
        </div>
      </section>
      
      {/* Dashed pattern divider */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-dashed border-blue-200"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="px-6 py-4 bg-white rounded-full border border-blue-100 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-xl text-blue-400">❀</span>
              <span className="text-xl text-green-400">✿</span>
              <span className="text-xl text-blue-400">❀</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Spotlight Section */}
      <section className="py-16 relative overflow-hidden bg-white/70">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-200/20 to-green-200/20 blur-xl"></div>
                  <div className="relative p-4 bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src="/images/elfgirl.jpg"
                        alt="Featured anime content"
                        width={500}
                        height={375}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-60 blur-xl"></div>
                  </div>
                  
                  <div className="absolute -top-6 -right-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-300 to-green-300 rounded-full text-white text-xl">
                      ✨
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div>
                <span className="inline-block bg-gradient-to-r from-blue-100 to-green-100 px-4 py-1 rounded-full text-sm font-medium text-blue-600 mb-4">New Feature</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Find Your Next Favorite Anime</h2>
                <p className="text-slate-600 mb-6 text-lg">
                  Our personalized recommendation system helps you discover anime series tailored to your unique preferences and viewing history.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Personalized recommendations based on your taste",
                    "Filter by genre, season, studio, and more",
                    "Bookmark favorites to watch later",
                    "Track your watching progress"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex-shrink-0 w-5 h-5 mt-1 rounded-full bg-gradient-to-r from-blue-300 to-green-300 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <Link href="/recommendations" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-300 to-green-300 hover:from-blue-400 hover:to-green-400 text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  <span>Get Recommendations</span>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section with pastel design */}
      <section id="newsletter" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        <div className="absolute -top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/20 to-green-200/20 filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-green-200/20 to-blue-200/20 filter blur-3xl"></div>
        
        {/* Small decorative elements */}
        <motion.div 
          className="absolute top-12 left-1/4 w-8 h-8 rounded-full bg-blue-100"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4],
           }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-1/4 w-6 h-6 rounded-full bg-green-100"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.3, 0.6, 0.3],
           }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 right-16 w-4 h-4 rounded-full bg-teal-100"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
           }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <span className="block bg-gradient-to-r from-pink-200 to-purple-200 h-1 w-20 mx-auto mb-6 rounded-full"></span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Stay in the Loop
            </h2>
            <p className="text-slate-600 text-lg">
              Subscribe to our newsletter for the latest anime news, reviews, and recommendations.
            </p>
          </motion.div>
          
          <div className="bg-white p-8 rounded-2xl shadow-md border border-pink-100">
            <Newsletter />
          </div>
        </div>
      </section>
      
      {/* Footer decorative element */}
      <div className="h-6 bg-gradient-to-r from-pink-200 via-purple-200 to-lavender-200"></div>
    </main>
  );
}
