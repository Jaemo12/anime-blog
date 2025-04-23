'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRss, FaCheck, FaTimes } from 'react-icons/fa';
import GradientText from './GradientText';

interface NewsletterProps {
  variant?: 'default' | 'sidebar' | 'footer';
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export default function Newsletter({
  variant = 'default',
  title = 'Neural Link',
  description = 'Subscribe to our cybernetic consciousness stream for weekly updates on anime analysis and digital insights',
  buttonText = 'Connect',
  placeholder = 'Your neural address',
  className = ''
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    
    // In a real app, you would submit to your newsletter API
    // This is a simulation of that process
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setStatus('success');
      setMessage('Successfully subscribed to the newsletter!');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };
  
  // Variant styles
  const variants = {
    default: 'bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-8 md:p-12',
    sidebar: 'p-6 rounded-xl bg-white/60 backdrop-blur-sm shadow-md',
    footer: ''
  };
  
  const titleVariants = {
    default: 'text-3xl font-bold',
    sidebar: 'text-xl font-bold mb-4',
    footer: 'text-lg font-bold mb-4 border-b border-white/10 pb-2'
  };
  
  const descriptionVariants = {
    default: 'text-center text-lg mb-8 text-gray-600 max-w-2xl mx-auto',
    sidebar: 'text-gray-600 text-sm mb-4',
    footer: 'text-sm text-gray-300 mb-4'
  };
  
  const inputVariants = {
    default: 'flex-grow px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30',
    sidebar: 'w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30',
    footer: 'w-full px-4 py-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]'
  };
  
  const buttonVariants = {
    default: 'px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white font-medium rounded-md',
    sidebar: 'w-full py-3 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white font-medium rounded-md',
    footer: 'mt-3 w-full py-3 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white font-medium rounded-md'
  };
  
  const disclaimerVariants = {
    default: 'mt-6 text-center text-sm text-gray-500',
    sidebar: 'text-xs text-gray-500 text-center mt-2',
    footer: 'text-xs text-gray-400 mt-2'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {variant === 'default' && (
        <div className="flex items-center justify-center mb-6">
          <FaRss className="text-2xl text-[#8b5cf6] mr-3" />
          <h2 className={titleVariants[variant]}>
            <span className="text-[#171717]">Neural</span>
            <GradientText className="ml-2">Link</GradientText>
          </h2>
        </div>
      )}
      
      {variant !== 'default' && (
        <h3 className={titleVariants[variant]}>
          {variant === 'sidebar' ? (
            <>
              <GradientText>Subscribe</GradientText>
            </>
          ) : (
            title
          )}
        </h3>
      )}
      
      <p className={descriptionVariants[variant]}>
        {description}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className={variant === 'default' ? 'flex flex-col sm:flex-row gap-3 max-w-xl mx-auto' : ''}>
          <input 
            type="email" 
            placeholder={placeholder} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className={inputVariants[variant]}
          />
          
          <motion.button 
            type="submit"
            className={buttonVariants[variant]}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading' || status === 'success'}
          >
            <span className="relative z-10 flex items-center justify-center">
              {status === 'idle' && buttonText}
              {status === 'loading' && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {status === 'success' && <FaCheck />}
              {status === 'error' && <FaTimes />}
            </span>
          </motion.button>
        </div>
        
        {message && (
          <motion.div 
            className={`mt-3 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}
      </form>
      
      <div className={disclaimerVariants[variant]}>
        No neural implants required. Unsubscribe anytime with a thought.
      </div>
    </div>
  );
}