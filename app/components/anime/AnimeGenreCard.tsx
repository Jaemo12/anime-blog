'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AnimeGenreCardProps {
  genre: {
    id: string;
    name: string;
    count?: number;
    description?: string;
    color?: string;
    icon?: ReactNode;
  };
  className?: string;
}

export default function AnimeGenreCard({ genre, className = '' }: AnimeGenreCardProps) {
  // Default colors mapped to genre types
  const defaultColors: Record<string, string> = {
    'action': 'from-red-500 to-orange-500',
    'adventure': 'from-amber-500 to-yellow-500',
    'comedy': 'from-yellow-400 to-green-400',
    'drama': 'from-blue-600 to-indigo-500',
    'fantasy': 'from-purple-500 to-pink-500',
    'horror': 'from-gray-800 to-gray-900',
    'mystery': 'from-indigo-700 to-purple-800',
    'romance': 'from-pink-400 to-red-400',
    'sci-fi': 'from-cyan-500 to-blue-500',
    'slice of life': 'from-green-400 to-teal-500',
    'sports': 'from-orange-500 to-amber-500',
    'supernatural': 'from-violet-600 to-purple-600',
    'thriller': 'from-red-600 to-pink-700',
    'mecha': 'from-gray-600 to-blue-400',
  };
  
  // Get color gradient for genre
  const getColorGradient = () => {
    // Use custom color if provided
    if (genre.color) return genre.color;
    
    // Use default color from mapping if exists (case insensitive)
    const genreLower = genre.name.toLowerCase();
    for (const [key, value] of Object.entries(defaultColors)) {
      if (genreLower.includes(key)) {
        return value;
      }
    }
    
    // Default fallback
    return 'from-[#8b5cf6] to-[#e879f9]';
  };
  
  const colorGradient = getColorGradient();
  
  return (
    <motion.div
      className={`${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        href={`/anime/genres/${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
        className="block h-full"
      >
        <div className={`bg-gradient-to-br ${colorGradient} text-white rounded-lg overflow-hidden shadow-md h-full flex flex-col`}>
          <div className="p-6 flex flex-col items-center text-center h-full justify-center">
            {genre.icon && (
              <div className="text-4xl mb-3 opacity-90">
                {genre.icon}
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-1">
              {genre.name}
            </h3>
            
            {genre.count !== undefined && (
              <div className="text-sm font-medium bg-black/20 px-2 py-0.5 rounded-full mt-2">
                {genre.count} anime
              </div>
            )}
            
            {genre.description && (
              <p className="mt-3 text-sm text-white/90 line-clamp-2">
                {genre.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}