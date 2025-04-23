'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShare, FaTwitter, FaFacebook, FaReddit, FaLink, FaTimes } from 'react-icons/fa';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  showLabel?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'dropdown';
  className?: string;
}

export default function SocialShare({
  url,
  title = '',
  description = '',
  imageUrl = '',
  showLabel = false,
  orientation = 'horizontal',
  className = ''
}: SocialShareProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Get current URL if not provided
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(url || window.location.href);
    }
  }, [url]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Copy link handler
  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setIsCopied(true);
        // Auto close dropdown if in dropdown mode
        if (orientation === 'dropdown') {
          setTimeout(() => {
            setIsDropdownOpen(false);
          }, 1000);
        }
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };
  
  // Generate social share links
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`;
  
  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  
  // Horizontal layout (default)
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showLabel && (
          <span className="text-gray-500 text-sm">Share:</span>
        )}
        
        <motion.a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 text-[#1DA1F2] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </motion.a>
        
        <motion.a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 text-[#4267B2] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Facebook"
        >
          <FaFacebook />
        </motion.a>
        
        <motion.a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 text-[#FF4500] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Reddit"
        >
          <FaReddit />
        </motion.a>
        
        <motion.button
          onClick={copyLink}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 text-[#8b5cf6] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Copy link"
        >
          {isCopied ? <FaTimes /> : <FaLink />}
        </motion.button>
      </div>
    );
  }
  
  // Vertical layout
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        {showLabel && (
          <span className="text-gray-500 text-xs mb-1">Share</span>
        )}
        
        <motion.a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 text-[#1DA1F2] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </motion.a>
        
        <motion.a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 text-[#4267B2] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Facebook"
        >
          <FaFacebook />
        </motion.a>
        
        <motion.a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 text-[#FF4500] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share on Reddit"
        >
          <FaReddit />
        </motion.a>
        
        <motion.button
          onClick={copyLink}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 text-[#8b5cf6] shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Copy link"
        >
          {isCopied ? <FaTimes /> : <FaLink />}
        </motion.button>
        
        {isCopied && (
          <span className="text-xs text-[#8b5cf6] font-medium">Copied!</span>
        )}
      </div>
    );
  }
  
  // Dropdown layout
  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 text-[#8b5cf6] shadow-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Share"
        aria-expanded={isDropdownOpen}
      >
        <FaShare />
      </motion.button>
      
      {showLabel && (
        <span className="text-xs text-gray-500 mt-1 block text-center">Share</span>
      )}
      
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute top-0 left-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 w-40 z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            <div className="flex flex-col space-y-2">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md"
              >
                <FaTwitter className="mr-2 text-[#1DA1F2]" />
                Twitter
              </a>
              
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md"
              >
                <FaFacebook className="mr-2 text-[#4267B2]" />
                Facebook
              </a>
              
              <a
                href={redditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md"
              >
                <FaReddit className="mr-2 text-[#FF4500]" />
                Reddit
              </a>
              
              <button
                onClick={copyLink}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#8b5cf6]/10 rounded-md"
              >
                <FaLink className="mr-2 text-[#8b5cf6]" />
                {isCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}