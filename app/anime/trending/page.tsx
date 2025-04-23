'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GradientText from '@/app/components/ui/GradientText';
import AnimeGrid from '@/app/components/anime/AnimeGrid';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { fetchTrendingAnime } from '@/app/lib/api';
import Link from 'next/link';

// Custom sparkle icon component
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

interface AnimeItem {
  id: number;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  episodes: number;
  studio: string;
  year: number;
  status: string;
}

// Filter options
const FILTER_OPTIONS = {
  genres: [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 
    'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 
    'Supernatural', 'Thriller'
  ],
  status: ['Airing', 'Completed', 'Upcoming'],
  year: ['2025', '2024', '2023', '2022', '2021', '2020', 'Older'],
  studios: [
    'MAPPA', 'Wit Studio', 'Ufotable', 'Kyoto Animation', 'Madhouse',
    'A-1 Pictures', 'Bones', 'Production I.G', 'CloverWorks', 'Sunrise'
  ]
};

interface FilterState {
  genres: string[];
  status: string[];
  year: string[];
  studios: string[];
  sortBy: string;
}

// Custom filter UI that matches the light pastel aesthetic
const AnimeFilterPastel = ({
  options,
  activeFilters,
  onChange
}: {
  options: typeof FILTER_OPTIONS;
  activeFilters: FilterState;
  onChange: (filters: FilterState) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Toggle genre selection
  const toggleGenre = (genreName: string) => {
    if (activeFilters.genres.includes(genreName)) {
      onChange({
        ...activeFilters,
        genres: activeFilters.genres.filter(g => g !== genreName)
      });
    } else {
      onChange({
        ...activeFilters,
        genres: [...activeFilters.genres, genreName]
      });
    }
  };
  
  // Toggle studio selection
  const toggleStudio = (studioName: string) => {
    if (activeFilters.studios.includes(studioName)) {
      onChange({
        ...activeFilters,
        studios: activeFilters.studios.filter(s => s !== studioName)
      });
    } else {
      onChange({
        ...activeFilters,
        studios: [...activeFilters.studios, studioName]
      });
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    onChange({
      genres: [],
      status: [],
      year: [],
      studios: [],
      sortBy: 'popularity'
    });
  };
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };
  
  // Color-coded genre pills
  const genreColors: Record<string, string> = {
    'Action': 'bg-rose-100 text-rose-700 border-rose-200',
    'Adventure': 'bg-amber-100 text-amber-700 border-amber-200',
    'Comedy': 'bg-lime-100 text-lime-700 border-lime-200',
    'Drama': 'bg-blue-100 text-blue-700 border-blue-200',
    'Fantasy': 'bg-violet-100 text-violet-700 border-violet-200',
    'Horror': 'bg-slate-100 text-slate-700 border-slate-200',
    'Mecha': 'bg-zinc-100 text-zinc-700 border-zinc-200',
    'Mystery': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Psychological': 'bg-purple-100 text-purple-700 border-purple-200',
    'Romance': 'bg-pink-100 text-pink-700 border-pink-200',
    'Sci-Fi': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Slice of Life': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Supernatural': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    'Thriller': 'bg-orange-100 text-orange-700 border-orange-200',
  };
  
  const getGenreColor = (genre: string) => {
    return genreColors[genre] || 'bg-lavender-100 text-lavender-700 border-lavender-200';
  };
  
  // Determine if we have filters applied
  const hasActiveFilters = activeFilters.genres.length > 0 || 
                          activeFilters.status.length > 0 || 
                          activeFilters.year.length > 0 || 
                          activeFilters.studios.length > 0;
  
  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Search input */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search anime titles..."
            className="w-full px-4 py-3 pr-10 rounded-xl bg-lavender-50 border border-lavender-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>
      
      {/* Filter groups */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Genres section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Genres</h3>
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'genres' ? null : 'genres')}
                className="text-violet-500 hover:text-violet-700 text-sm font-medium flex items-center gap-1"
              >
                {openDropdown === 'genres' ? 'Collapse' : 'Expand'}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openDropdown === 'genres' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Selected genres */}
            <div className="flex flex-wrap gap-2 mb-2">
              {activeFilters.genres.length === 0 ? (
                <span className="text-sm text-gray-400">No genres selected</span>
              ) : (
                activeFilters.genres.map(genre => (
                  <span 
                    key={genre}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${getGenreColor(genre)} border`}
                  >
                    {genre}
                    <button 
                      className="ml-1.5 bg-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-100"
                      onClick={() => toggleGenre(genre)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))
              )}
            </div>
            
            {/* Genre selection dropdown */}
            <motion.div 
              initial="hidden"
              animate={openDropdown === 'genres' ? "visible" : "hidden"}
              variants={dropdownVariants}
              className={`${openDropdown === 'genres' ? 'block' : 'hidden'} mt-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar`}
            >
              <div className="grid grid-cols-2 gap-2">
                {options.genres.map(genre => (
                  <div 
                    key={genre} 
                    className={`rounded-lg border border-gray-200 ${activeFilters.genres.includes(genre) ? getGenreColor(genre) : 'bg-white'} p-2 flex items-center cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => toggleGenre(genre)}
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.genres.includes(genre)}
                      onChange={() => {}}
                      className="mr-2 accent-violet-500 h-4 w-4"
                    />
                    <span className={activeFilters.genres.includes(genre) ? '' : 'text-gray-700'}>
                      {genre}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Status, Year, Studios section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <select
                  value={activeFilters.status.length > 0 ? activeFilters.status[0] : ''}
                  onChange={(e) => onChange({
                    ...activeFilters, 
                    status: e.target.value ? [e.target.value] : []
                  })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                >
                  <option value="">Any Status</option>
                  {options.status.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="relative">
                <select
                  value={activeFilters.year.length > 0 ? activeFilters.year[0] : ''}
                  onChange={(e) => onChange({
                    ...activeFilters,
                    year: e.target.value ? [e.target.value] : []
                  })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                >
                  <option value="">Any Year</option>
                  {options.year.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="relative">
                <select
                  value={activeFilters.sortBy}
                  onChange={(e) => onChange({...activeFilters, sortBy: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Studios section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Studios</h3>
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'studios' ? null : 'studios')}
                className="text-violet-500 hover:text-violet-700 text-sm font-medium flex items-center gap-1"
              >
                {openDropdown === 'studios' ? 'Collapse' : 'Expand'}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openDropdown === 'studios' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Selected studios */}
            <div className="flex flex-wrap gap-2">
              {activeFilters.studios.length === 0 ? (
                <span className="text-sm text-gray-400">No studios selected</span>
              ) : (
                activeFilters.studios.map(studio => (
                  <span 
                    key={studio}
                    className="bg-lavender-100 text-lavender-700 border border-lavender-200 text-xs px-3 py-1.5 rounded-full flex items-center"
                  >
                    {studio}
                    <button 
                      className="ml-1.5 bg-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-100"
                      onClick={() => toggleStudio(studio)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))
              )}
            </div>
            
            {/* Studios selection dropdown */}
            <motion.div 
              initial="hidden"
              animate={openDropdown === 'studios' ? "visible" : "hidden"}
              variants={dropdownVariants}
              className={`${openDropdown === 'studios' ? 'block' : 'hidden'} mt-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar`}
            >
              <div className="grid grid-cols-2 gap-2">
                {options.studios.map(studio => (
                  <div 
                    key={studio} 
                    className={`rounded-lg border ${activeFilters.studios.includes(studio) ? 'bg-lavender-100 text-lavender-700 border-lavender-200' : 'bg-white border-gray-200'} p-2 flex items-center cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => toggleStudio(studio)}
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.studios.includes(studio)}
                      onChange={() => {}}
                      className="mr-2 accent-violet-500 h-4 w-4"
                    />
                    <span className={activeFilters.studios.includes(studio) ? '' : 'text-gray-700'}>
                      {studio}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Filter actions */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filters
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {hasActiveFilters && (
                <span className="bg-violet-100 text-violet-700 py-1 px-2.5 rounded-full font-medium">
                  {activeFilters.genres.length + activeFilters.studios.length + activeFilters.year.length + activeFilters.status.length} active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TrendingPage() {
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    genres: [],
    status: [],
    year: [],
    studios: [],
    sortBy: 'popularity'
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Fetch trending anime from API on component mount
  useEffect(() => {
    const loadTrendingAnime = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrendingAnime();
        setTrendingAnime(data);
        setFilteredAnime(data);
      } catch (err) {
        console.error('Failed to fetch trending anime:', err);
        setError('Failed to load trending anime. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingAnime();
  }, []);

  // Apply filters when activeFilters changes
  useEffect(() => {
    if (trendingAnime.length === 0) return;
    
    setIsLoading(true);
    
    // Apply filters
    let results = [...trendingAnime];
    
    // Filter by genres
    if (activeFilters.genres.length > 0) {
      results = results.filter(anime => 
        anime.genres.some(genre => activeFilters.genres.includes(genre))
      );
    }
    
    // Filter by status
    if (activeFilters.status.length > 0) {
      results = results.filter(anime => 
        activeFilters.status.includes(anime.status.toLowerCase())
      );
    }
    
    // Filter by year
    if (activeFilters.year.length > 0) {
      results = results.filter(anime => {
        const yearString = anime.year?.toString();
        if (activeFilters.year.includes(yearString)) return true;
        if (activeFilters.year.includes('Older') && anime.year < 2020) return true;
        return false;
      });
    }
    
    // Filter by studios
    if (activeFilters.studios.length > 0) {
      results = results.filter(anime => 
        activeFilters.studios.includes(anime.studio)
      );
    }
    
    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'rating':
        results = results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results = results.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        results = results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // 'popularity' - already sorted from the API
        break;
    }
    
    // Simulate a slight delay for a smoother UX
    setTimeout(() => {
      setFilteredAnime(results);
      setIsLoading(false);
    }, 300);
  }, [activeFilters, trendingAnime]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
  };

  // Format anime data to match AnimeGrid component expectations
const formattedAnimeList = filteredAnime.map((anime, index) => ({
  id: anime.id,  // Make sure this ID is passed correctly
  title: anime.title,
  image: anime.image,
  score: anime.rating,
  episodes: anime.episodes,
  year: anime.year,
  genres: anime.genres,
  studios: [anime.studio]
}));

  // Skelton loader
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
          <div className="w-full aspect-[3/4] bg-gradient-to-r from-lavender-100 to-pink-100"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-lavender-100 rounded-full w-3/4"></div>
            <div className="h-4 bg-pink-50 rounded-full w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-lavender-50 rounded-full"></div>
              <div className="h-6 w-16 bg-rose-50 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="bg-gradient-to-b from-lavender-50 via-pink-50 to-white text-gray-800 min-h-screen pt-24 pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 inset-x-0 -z-10 h-96 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-200/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-rose-200/30 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-amber-200/30 blur-xl"></div>
      </div>
      
      {/* Page Header */}
      <header className="relative py-16 mb-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mx-auto mb-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-6 bg-gradient-to-r from-transparent to-pink-300"></div>
                <div className="bg-gradient-to-r from-pink-400 to-violet-400 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <SparkleIcon />
                  <span>TRENDING NOW</span>
                  <SparkleIcon />
                </div>
                <div className="h-px w-6 bg-gradient-to-r from-violet-300 to-transparent"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Discover Trending Anime
            </h1>
            
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Explore the most popular anime that everyone is watching this season. Filter by genre, 
              studio, and more to find your next favorite series.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className="lg:w-1/3 xl:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <AnimeFilterPastel 
                options={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onChange={handleFilterChange}
              />
              
              {/* Quick links section */}
              <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <h3 className="font-medium text-gray-700 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { name: 'New Releases', href: '/anime/new-releases', icon: '✨' },
                    { name: 'Top Rated', href: '/anime/top-rated', icon: '⭐' },
                    { name: 'Romance', href: '/anime/genres/romance', icon: '💖' },
                    { name: 'Action', href: '/anime/genres/action', icon: '💥' },
                    { name: 'Fantasy', href: '/anime/genres/fantasy', icon: '🔮' }
                  ].map((link) => (
                    <Link 
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-lavender-50 text-gray-700 transition-colors"
                    >
                      <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full text-lg">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <div className="lg:w-2/3 xl:w-3/4">
            {/* Results and Sort Controls */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-full py-2 px-4 shadow-sm flex items-center gap-2">
                <span className="text-gray-500">Showing</span>
                <span className="font-medium text-violet-600 bg-lavender-100 py-0.5 px-2.5 rounded-full">
                  {formattedAnimeList.length}
                </span>
                <span className="text-gray-500">results</span>
              </div>
              
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full py-1.5 px-4 shadow-sm">
                <label htmlFor="sort" className="mr-2 text-gray-600 text-sm">Sort by:</label>
                <select 
                  id="sort"
                  className="bg-transparent border-none text-violet-600 font-medium focus:outline-none focus:ring-0 text-sm py-1"
                  value={activeFilters.sortBy}
                  onChange={(e) => setActiveFilters({...activeFilters, sortBy: e.target.value})}
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </motion.div>
            
            {/* Error State */}
            {error && (
              <motion.div 
                className="bg-white rounded-xl p-8 text-center shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">Something went wrong</h3>
                <p className="text-gray-600 mb-5">{error}</p>
                <button 
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium rounded-full shadow-md transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </motion.div>
            )}
            
            {/* Loading State */}
            {isLoading && !error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4"
              >
                <SkeletonLoader />
              </motion.div>
            )}
            
            {/* Empty State */}
            {!isLoading && !error && formattedAnimeList.length === 0 && (
              <motion.div 
                className="bg-white rounded-xl p-8 text-center shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-lavender-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">No anime found</h3>
                <p className="text-gray-600 mb-5">No anime match your current filters. Try adjusting your selection.</p>
                <button 
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium rounded-full shadow-md transition-colors"
                  onClick={() => handleFilterChange({
                    genres: [],
                    status: [],
                    year: [],
                    studios: [],
                    sortBy: 'popularity'
                  })}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
            
            {/* Anime Grid */}
            {!isLoading && !error && formattedAnimeList.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <AnimeGrid 
                  animeList={formattedAnimeList}
                  columns={3}
                  className="animate-fade-in"
                  emptyMessage={
                    <div className="text-center py-10">
                      <div className="emoji text-4xl mb-4">🔍</div>
                      <h3 className="text-xl font-medium mb-2">No anime match your filters</h3>
                      <p className="text-gray-600">Try adjusting your selection criteria.</p>
                    </div>
                  }
                />
              </motion.div>
            )}
            
            {/* Pagination section */}
            {!isLoading && !error && formattedAnimeList.length > 0 && (
              <motion.div 
                className="flex justify-center mt-12 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white rounded-full shadow-md inline-flex">
                  <button className="px-4 py-2 text-gray-400 hover:text-violet-500 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="px-4 py-2 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 font-medium rounded-full">1</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-violet-500">2</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-violet-500">3</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-violet-500">...</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-violet-500">10</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-violet-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4ff;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b4b4ff;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}