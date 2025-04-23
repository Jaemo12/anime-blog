'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fetchTrendingAnime } from '../../lib/api';

// Sparkle icon component for visual flair
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
    <path d="M12 3C12.5523 3 13 3.44772 13 4V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5V4C11 3.44772 11.4477 3 12 3Z" fill="currentColor" />
    <path d="M12 18C12.5523 18 13 18.4477 13 19V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V19C11 18.4477 11.4477 18 12 18Z" fill="currentColor" />
    <path d="M20 12C20 11.4477 19.5523 11 19 11H18C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H19C19.5523 13 20 12.5523 20 12Z" fill="currentColor" />
    <path d="M6 12C6 11.4477 5.55228 11 5 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H5C5.55228 13 6 12.5523 6 12Z" fill="currentColor" />
    <path d="M16.9497 7.05025C17.3403 6.65972 17.3403 6.02656 16.9497 5.63603L16.2426 4.92893C15.8521 4.53841 15.219 4.53841 14.8284 4.92893C14.4379 5.31946 14.4379 5.95262 14.8284 6.34315L15.5355 7.05025C15.9261 7.44077 16.5592 7.44077 16.9497 7.05025Z" fill="currentColor" />
    <path d="M9.17154 14.8284C9.56207 14.4379 9.56207 13.8047 9.17154 13.4142L8.46444 12.7071C8.07392 12.3166 7.44075 12.3166 7.05023 12.7071C6.6597 13.0976 6.6597 13.7308 7.05023 14.1213L7.75733 14.8284C8.14786 15.219 8.78102 15.219 9.17154 14.8284Z" fill="currentColor" />
    <path d="M7.05023 7.05025C7.44075 7.44077 8.07392 7.44077 8.46444 7.05025L9.17154 6.34315C9.56207 5.95262 9.56207 5.31946 9.17154 4.92893C8.78102 4.53841 8.14786 4.53841 7.75733 4.92893L7.05023 5.63603C6.6597 6.02656 6.6597 6.65972 7.05023 7.05025Z" fill="currentColor" />
    <path d="M14.8284 14.8284C15.219 15.219 15.8521 15.219 16.2426 14.8284L16.9497 14.1213C17.3403 13.7308 17.3403 13.0976 16.9497 12.7071C16.5592 12.3166 15.926 12.3166 15.5355 12.7071L14.8284 13.4142C14.4379 13.8047 14.4379 14.4379 14.8284 14.8284Z" fill="currentColor" />
  </svg>
);

// Loading shimmer component
const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="bg-gradient-to-r from-lavender-200 to-pink-100 h-80"></div>
    <div className="p-5 space-y-3 bg-white">
      <div className="h-5 bg-lavender-100 rounded w-4/5"></div>
      <div className="h-4 bg-pink-50 rounded w-2/3"></div>
    </div>
  </div>
);

// Interface for anime data
interface Anime {
  id: number;
  title: string;
  image: string;
  rating?: number;
  genres?: string[];
  episodes?: number;
  studio?: string;
  year?: number;
  status?: string;
}

const TrendingSection: React.FC = () => {
  // Mock data to use if API fetch fails or during development
  const mockTrendingAnime: Anime[] = [
    {
      id: 1,
      title: 'Neon Nexus',
      image: '/images/anime/neon-nexus.jpg',
      rating: 9.2,
      genres: ['Cyberpunk', 'Action', 'Sci-Fi'],
      episodes: 24,
      year: 2025,
      status: 'Airing'
    },
    {
      id: 2,
      title: 'Chrono Samurai',
      image: '/images/anime/chrono-samurai.jpg',
      rating: 8.9,
      genres: ['Historical', 'Fantasy', 'Action'],
      episodes: 12,
      year: 2025,
      status: 'Airing'
    },
    {
      id: 3,
      title: 'Ethereal Garden',
      image: '/images/anime/ethereal-garden.jpg',
      rating: 9.5,
      genres: ['Drama', 'Supernatural', 'Romance'],
      episodes: 22,
      year: 2025,
      status: 'Airing'
    },
    {
      id: 4,
      title: 'Mecha Odyssey',
      image: '/images/anime/mecha-odyssey.jpg',
      rating: 8.7,
      genres: ['Mecha', 'Space', 'Military'],
      episodes: 26,
      year: 2024,
      status: 'Completed'
    }
  ];

  const [trending, setTrending] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setIsLoading(true);
        // Attempt to fetch from API
        const data = await fetchTrendingAnime();
        
        // If data is returned and has length, use it
        if (data && data.length > 0) {
          setTrending(data.slice(0, 4)); // Get first 4 trending anime
        } else {
          // Fall back to mock data if API returns empty
          setTrending(mockTrendingAnime);
        }
      } catch (error) {
        console.error('Failed to fetch trending anime:', error);
        // Fall back to mock data on error
        setTrending(mockTrendingAnime);
        setError('Could not load trending anime. Using sample data instead.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrending();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
        damping: 24
      }
    }
  };

  // Pastel color schemes for cards
  const cardColors = [
    {
      bg: "bg-gradient-to-b from-rose-50 to-rose-100",
      accent: "bg-rose-400",
      text: "text-rose-600",
      genreBg: "bg-rose-100",
      genreText: "text-rose-700",
      secondary: "text-rose-300"
    },
    {
      bg: "bg-gradient-to-b from-violet-50 to-violet-100",
      accent: "bg-violet-400",
      text: "text-violet-600",
      genreBg: "bg-violet-100",
      genreText: "text-violet-700",
      secondary: "text-violet-300"
    },
    {
      bg: "bg-gradient-to-b from-amber-50 to-amber-100",
      accent: "bg-amber-400",
      text: "text-amber-600",
      genreBg: "bg-amber-100",
      genreText: "text-amber-700",
      secondary: "text-amber-300"
    },
    {
      bg: "bg-gradient-to-b from-emerald-50 to-emerald-100",
      accent: "bg-emerald-400",
      text: "text-emerald-600",
      genreBg: "bg-emerald-100",
      genreText: "text-emerald-700",
      secondary: "text-emerald-300"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender-50 via-pink-50 to-mint-50"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-200/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-rose-200/30 blur-xl"></div>
        <div className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-amber-200/30 blur-xl"></div>
        
        {/* Animated floating particles */}
        <div className="absolute top-20 left-1/4 w-3 h-3 rounded-full bg-pink-300 animate-float opacity-70"></div>
        <div className="absolute top-40 right-1/3 w-2 h-2 rounded-full bg-violet-300 animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 left-1/3 w-4 h-4 rounded-full bg-amber-300 animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header with animation */}
        <motion.div 
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="inline-block mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-pink-300"></div>
              <div className="bg-gradient-to-r from-pink-300 to-violet-300 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <SparkleIcon />
                <span>TRENDING NOW</span>
                <SparkleIcon />
              </div>
              <div className="h-px w-6 bg-gradient-to-r from-violet-300 to-transparent"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              What's Hot This Season
            </h2>
            
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover the most popular anime that everyone is watching right now
            </p>
          </div>
        </motion.div>
        
        {/* Main content area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {trending.map((anime, index) => (
              <motion.div 
                key={anime.id} 
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative"
              >
                {/* High-end card design with pastel colors */}
                <div className={`rounded-2xl overflow-hidden shadow-lg group relative transform transition-all duration-300 hover:-translate-y-3 hover:shadow-xl ${cardColors[index].bg}`}>
                  {/* Top accent bar */}
                  <div className={`h-1.5 ${cardColors[index].accent} w-full`}></div>
                  
                  {/* Image container with overlay */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Fallback image path if anime.image is external */}
                    <Image
                      src={anime.image || '/images/placeholder-anime.jpg'}
                      alt={anime.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Episode count badge */}
                    {anime.episodes && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {anime.episodes} Episodes
                      </div>
                    )}
                    
                    {/* Rating badge */}
                    {anime.rating && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                        <svg className="w-3 h-3 text-white mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {anime.rating.toFixed(1)}
                      </div>
                    )}
                    
                    {/* Studio and year */}
                    {(anime.studio || anime.year) && (
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {anime.studio && (
                          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                            {anime.studio}
                          </div>
                        )}
                        {anime.year && (
                          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                            {anime.year}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Content area */}
                  <div className="p-5">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${cardColors[index].text}`}>
                      {anime.title}
                    </h3>
                    
                    {/* Genres with color-coded badges */}
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {anime.genres.slice(0, 3).map((genre, idx) => (
                          <span
                            key={idx}
                            className={`text-xs font-medium ${cardColors[index].genreBg} ${cardColors[index].genreText} px-2.5 py-1 rounded-full`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* View button that appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link 
                      href={`/anime/${anime.id}`}
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-violet-600 font-medium px-5 py-2.5 rounded-full shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                
                {/* Decorative position indicator dots */}
                <div className="hidden md:flex justify-center mt-4 gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${i === index ? cardColors[index].accent : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error message display */}
        {error && (
          <motion.div 
            className="mt-6 text-center rounded-full bg-amber-100 text-amber-800 py-2 px-4 mx-auto max-w-md font-medium text-sm shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.div>
        )}
        
        {/* View more button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;