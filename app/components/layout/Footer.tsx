'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaDiscord, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaEnvelope, FaArrowRight } from 'react-icons/fa';

// Gradient Text component
const GradientText: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = "" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 ${className}`}>
      {children}
    </span>
  );
};

// Social media links with consistent styling
const SocialLink: React.FC<{ icon: React.ReactNode; label: string; href?: string }> = ({ icon, label, href = "#" }) => (
  <motion.a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors"
    whileHover={{ y: -3, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden">
      {/* Top colored border */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500"></div>
      
      {/* Main footer */}
      <div className="bg-gradient-to-br from-indigo-100 to-fuchsia-50">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo and about */}
            <div className="space-y-4">
              <motion.h2 
                className="text-3xl font-black"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GradientText>ANIME</GradientText>
                <span className="text-gray-800">VERSE</span>
              </motion.h2>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Your gateway to the colorful worlds of anime, exploring vibrant aesthetics, philosophical themes, and the artistic brilliance that defines the medium.
              </p>
              
              <div className="flex space-x-3 pt-2">
                <SocialLink icon={<FaTwitter />} label="Twitter" />
                <SocialLink icon={<FaInstagram />} label="Instagram" />
                <SocialLink icon={<FaDiscord />} label="Discord" />
                <SocialLink icon={<FaYoutube />} label="YouTube" />
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Trending Anime', 'Blog', 'About Us', 'Contact'].map(item => (
                  <motion.li key={item} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <Link 
                      href={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-600 hover:text-indigo-600 transition-colors inline-block py-1"
                    >
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Blog Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Categories</h3>
              <ul className="space-y-2">
                {['Analysis', 'Reviews', 'Philosophy', 'Studios', 'Characters'].map(category => (
                  <motion.li key={category} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <Link 
                      href={`/blog/categories/${category.toLowerCase()}`} 
                      className="text-gray-600 hover:text-indigo-600 transition-colors inline-block py-1"
                    >
                      {category}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to our newsletter for weekly anime insights and exclusive content.
              </p>
              
              <div className="space-y-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 rounded-full bg-white shadow-sm border border-indigo-100 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white p-2 rounded-full hover:from-indigo-600 hover:to-fuchsia-600 transition-colors">
                    <FaArrowRight />
                  </button>
                </motion.div>
                
                <p className="text-xs text-gray-500">
                  Join our community today. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-indigo-100">
            <div className="text-sm text-gray-500">
              &copy; {currentYear} AnimeVerse. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(policy => (
                <Link 
                  key={policy}
                  href={`/${policy.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {policy}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}