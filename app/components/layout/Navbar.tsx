'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserAstronaut, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { IoIosPlanet } from 'react-icons/io';
import GradientText from '../ui/GradientText';

// In a real implementation, create this elsewhere
const GradientTextComponent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = "" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#ec4899] animate-gradient-x ${className}`}>
      {children}
    </span>
  );
};

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimeDropdownOpen, setIsAnimeDropdownOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  
  // Check scroll position to adjust navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleAnimeDropdown = () => {
    setIsAnimeDropdownOpen(!isAnimeDropdownOpen);
    if (!isAnimeDropdownOpen) {
      setIsBlogDropdownOpen(false);
    }
  };
  
  const toggleBlogDropdown = () => {
    setIsBlogDropdownOpen(!isBlogDropdownOpen);
    if (!isBlogDropdownOpen) {
      setIsAnimeDropdownOpen(false);
    }
  };
  
  // Determine navbar classes based on scroll and transparent prop
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    (isScrolled || !transparent) 
      ? 'bg-white/80 backdrop-blur-md shadow-md py-3' 
      : 'bg-transparent py-5'
  }`;
  
  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.3, staggerChildren: 0.05 }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-10 h-10 mr-2">
            <motion.div
              className="absolute inset-0 rounded-full bg-[#8b5cf6] opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
                rotate: [0, 90]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full bg-[#d946ef] opacity-30"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.2, 0.3],
                rotate: [90, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-[#6d28d9] font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <IoIosPlanet className="text-2xl" />
            </motion.div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-black text-xl leading-none">
              <GradientTextComponent>ANIME</GradientTextComponent>
              <span className={transparent && !isScrolled ? 'text-white' : 'text-[#171717]'}>VERSE</span>
            </h1>
            <span className="text-xs mt-px leading-none font-light tracking-wider text-gray-500">Your cyberpunk portal</span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <button 
              className={`flex items-center ${transparent && !isScrolled ? 'text-white hover:text-white/80' : 'text-[#171717] hover:text-[#8b5cf6]'} transition-colors`}
              onClick={toggleAnimeDropdown}
            >
              Anime
              <FaChevronDown className="ml-1 text-xs" />
            </button>
            
            <AnimatePresence>
              {isAnimeDropdownOpen && (
                <motion.div 
                  className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Link href="/anime/trending" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Trending Anime
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/anime/genres" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Anime by Genre
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/anime/studios" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Studios
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/anime/seasons" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Seasonal Anime
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative group">
            <button 
              className={`flex items-center ${transparent && !isScrolled ? 'text-white hover:text-white/80' : 'text-[#171717] hover:text-[#8b5cf6]'} transition-colors`}
              onClick={toggleBlogDropdown}
            >
              Blog
              <FaChevronDown className="ml-1 text-xs" />
            </button>
            
            <AnimatePresence>
              {isBlogDropdownOpen && (
                <motion.div 
                  className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Latest Posts
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/blog/categories" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Categories
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/blog/featured" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Featured Articles
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/blog/authors" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                      Our Authors
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link 
            href="/about" 
            className={`${transparent && !isScrolled ? 'text-white hover:text-white/80' : 'text-[#171717] hover:text-[#8b5cf6]'} transition-colors`}
          >
            About
          </Link>
          
          <Link 
            href="/contact" 
            className={`${transparent && !isScrolled ? 'text-white hover:text-white/80' : 'text-[#171717] hover:text-[#8b5cf6]'} transition-colors`}
          >
            Contact
          </Link>
        </div>
        
        {/* Search and Profile */}
        <div className="flex items-center space-x-4">
          <button 
            className={`p-2 rounded-full ${
              transparent && !isScrolled 
                ? 'text-white hover:bg-white/10' 
                : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
            } transition-all`}
            aria-label="Search"
          >
            <FaSearch />
          </button>
          
          <button 
            className={`p-2 rounded-full ${
              transparent && !isScrolled 
                ? 'text-white hover:bg-white/10' 
                : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
            } transition-all hidden md:block`}
            aria-label="Profile"
          >
            <FaUserAstronaut />
          </button>
          
          <motion.button 
            className={`p-2 rounded-full md:hidden ${
              transparent && !isScrolled 
                ? 'text-white hover:bg-white/10' 
                : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
            } transition-all`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-40 pt-20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="p-4 max-w-md mx-auto">
              <div className="divide-y divide-[#8b5cf6]/10">
                <div className="py-4">
                  <div 
                    className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/5" 
                    onClick={() => setIsAnimeDropdownOpen(!isAnimeDropdownOpen)}
                  >
                    <span className="font-medium">Anime</span>
                    <FaChevronDown className={`transform transition-transform ${isAnimeDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isAnimeDropdownOpen && (
                      <motion.div 
                        className="mt-2 ml-4 space-y-2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        <motion.div variants={itemVariants}>
                          <Link href="/anime/trending" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Trending Anime
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/anime/genres" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Anime by Genre
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/anime/studios" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Studios
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/anime/seasons" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Seasonal Anime
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="py-4">
                  <div 
                    className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/5" 
                    onClick={() => setIsBlogDropdownOpen(!isBlogDropdownOpen)}
                  >
                    <span className="font-medium">Blog</span>
                    <FaChevronDown className={`transform transition-transform ${isBlogDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isBlogDropdownOpen && (
                      <motion.div 
                        className="mt-2 ml-4 space-y-2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        <motion.div variants={itemVariants}>
                          <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Latest Posts
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/blog/categories" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Categories
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/blog/featured" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Featured Articles
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link href="/blog/authors" className="block px-4 py-2 text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md">
                            Our Authors
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="py-4">
                  <Link href="/about" className="block px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/5 font-medium">
                    About
                  </Link>
                </div>
                
                <div className="py-4">
                  <Link href="/contact" className="block px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/5 font-medium">
                    Contact
                  </Link>
                </div>
                
                <div className="py-4">
                  <Link href="/login" className="block px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/5 font-medium">
                    Login / Sign Up
                  </Link>
                </div>
              </div>
              
              {/* Mobile search */}
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anime, articles..."
                    className="w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 pl-10"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b5cf6]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}