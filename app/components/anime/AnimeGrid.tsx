'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import AnimeCard from './AnimeCard';
import GradientText from '../ui/GradientText';

interface Anime {
  id: string | number;
  title: string;
  image: string;
  score?: number;
  episodes?: number;
  year?: number;
  season?: string;
  genres?: string[];
  studios?: string[];
  slug?: string;
  viewCount?: number;
  featured?: boolean;
}

interface AnimeGridProps {
  animeList: Anime[];
  title?: string;
  subtitle?: string;
  featuredLayout?: boolean;
  showFeaturedAnime?: boolean;
  className?: string;
  columns?: 2 | 3 | 4 | 5;
  emptyMessage?: string | ReactNode;
  withFilter?: boolean;
}

export default function AnimeGrid({
  animeList,
  title,
  subtitle,
  featuredLayout = false,
  showFeaturedAnime = true,
  className = '',
  columns = 4,
  emptyMessage = 'No anime found',
  withFilter = false
}: AnimeGridProps) {
  // Filter featured anime if needed
  const featuredAnime = showFeaturedAnime ? animeList.filter(anime => anime.featured) : [];
  
  // Rest of the anime (if featuredLayout is true and there are featured anime)
  const regularAnime = featuredLayout && featuredAnime.length > 0
    ? animeList.filter(anime => !anime.featured)
    : animeList;
  
  // Determine column classes
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };
  
  // If there are no anime
  if (animeList.length === 0) {
    return (
      <div className={`p-8 rounded-xl bg-white/60 backdrop-blur-sm shadow-md text-center ${className}`}>
        {typeof emptyMessage === 'string' ? (
          <p className="text-gray-600">{emptyMessage}</p>
        ) : (
          emptyMessage
        )}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Title Section */}
      {title && (
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-bold">
              <GradientText>{title}</GradientText>
            </h2>
            <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
          </div>
          
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Featured Anime Section */}
      {featuredLayout && featuredAnime.length > 0 && (
        <div className="mb-10">
          {!title && (
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">
                <GradientText>Featured</GradientText> Anime
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {featuredAnime.slice(0, 1).map(anime => (
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                variant="featured" 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Regular Anime Grid */}
      {regularAnime.length > 0 && (
        <>
          {featuredLayout && featuredAnime.length > 0 && !title && (
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">
                <GradientText>Trending</GradientText> Anime
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
            </div>
          )}
          
          <div className={`grid ${columnClasses[columns]} gap-6`}>
          {regularAnime.map((anime, index) => (
            <AnimeCard 
              key={`${anime.id}-${index}`} // This ensures unique keys even if IDs are duplicated
              anime={anime} 
            />
          ))}
        </div>
        </>
      )}
    </div>
  );
}