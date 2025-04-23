// app/components/anime/AnimeFilter.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaStar, FaChevronDown, FaSearch } from 'react-icons/fa';
import Button from '../ui/Button';

interface FilterOptions {
  genres: string[];
  status: string[];
  year: string[];
  studios: string[];
}

interface FilterState {
  genres: string[];
  status: string[];
  year: string[];
  studios: string[];
  sortBy: string;
}

interface AnimeFilterProps {
  options: FilterOptions;
  activeFilters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
  compact?: boolean;
}

export default function AnimeFilter({
  options,
  activeFilters,
  onChange,
  className = '',
  compact = false
}: AnimeFilterProps) {
  // UI state
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showStudioDropdown, setShowStudioDropdown] = useState(false);
  
  // Apply filters
  const applyFilters = () => {
    onChange(activeFilters);
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
  
  // Animation variants
  const expandVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    visible: { 
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
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
  
  // Determine if we have filters applied
  const hasActiveFilters = activeFilters.genres.length > 0 || 
                          activeFilters.status.length > 0 || 
                          activeFilters.year.length > 0 || 
                          activeFilters.studios.length > 0;
  
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 ${className}`}>
      {/* Search and Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search anime..."
            className="w-full px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        {compact && (
          <Button
            variant={isExpanded ? "primary" : "secondary"}
            onClick={() => setIsExpanded(!isExpanded)}
            icon={<FaFilter />}
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={expandVariants}
            className="mt-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowGenreDropdown(!showGenreDropdown);
                    if (showStudioDropdown) setShowStudioDropdown(false);
                  }}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                >
                  <span className="truncate">
                    {activeFilters.genres.length 
                      ? `${activeFilters.genres.length} selected` 
                      : 'Select genres'}
                  </span>
                  <FaChevronDown className={`transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showGenreDropdown && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute z-20 left-0 right-0 mt-1 bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg max-h-60 overflow-y-auto py-1 border border-gray-700"
                    >
                      {options.genres.map((genre) => (
                        <div 
                          key={genre} 
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => toggleGenre(genre)}
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters.genres.includes(genre)}
                            onChange={() => {}}
                            className="mr-2 accent-pink-500"
                          />
                          <span className="text-white">{genre}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <select
                  value={activeFilters.year.length > 0 ? activeFilters.year[0] : ''}
                  onChange={(e) => onChange({
                    ...activeFilters,
                    year: e.target.value ? [e.target.value] : []
                  })}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any Year</option>
                  {options.year.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={activeFilters.status.length > 0 ? activeFilters.status[0] : ''}
                  onChange={(e) => onChange({
                    ...activeFilters, 
                    status: e.target.value ? [e.target.value] : []
                  })}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any Status</option>
                  {options.status.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={activeFilters.sortBy}
                  onChange={(e) => onChange({...activeFilters, sortBy: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
              
              {/* Studios */}
              {options.studios.length > 0 && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Studios</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudioDropdown(!showStudioDropdown);
                      if (showGenreDropdown) setShowGenreDropdown(false);
                    }}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                  >
                    <span className="truncate">
                      {activeFilters.studios.length 
                        ? `${activeFilters.studios.length} selected` 
                        : 'Select studios'}
                    </span>
                    <FaChevronDown className={`transition-transform ${showStudioDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showStudioDropdown && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute z-20 left-0 right-0 mt-1 bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg max-h-60 overflow-y-auto py-1 border border-gray-700"
                      >
                        {options.studios.map((studio) => (
                          <div 
                            key={studio} 
                            className="px-3 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                            onClick={() => toggleStudio(studio)}
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.studios.includes(studio)}
                              onChange={() => {}}
                              className="mr-2 accent-pink-500"
                            />
                            <span className="text-white">{studio}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value="1"
                    className="flex-grow h-2 appearance-none rounded-full bg-gray-700 accent-pink-500"
                  />
                  <span className="text-xs flex items-center text-gray-400">
                    10 <FaStar className="ml-1 text-amber-400" />
                  </span>
                </div>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <Button
                variant="ghost"
                onClick={resetFilters}
                icon={<FaTimes />}
              >
                Reset Filters
              </Button>
              
              <Button
                variant="primary"
                onClick={applyFilters}
                icon={<FaFilter />}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Selected Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-400">Active Filters:</span>
            
            {activeFilters.genres.map(genre => (
              <span 
                key={genre}
                className="bg-pink-900/50 text-pink-300 text-xs px-2 py-1 rounded-full flex items-center"
              >
                {genre}
                <button 
                  className="ml-1"
                  onClick={() => toggleGenre(genre)}
                >
                  &times;
                </button>
              </span>
            ))}
            
            {activeFilters.year.map(year => (
              <span 
                key={year}
                className="bg-pink-900/50 text-pink-300 text-xs px-2 py-1 rounded-full flex items-center"
              >
                {year}
                <button 
                  className="ml-1"
                  onClick={() => onChange({...activeFilters, year: activeFilters.year.filter(y => y !== year)})}
                >
                  &times;
                </button>
              </span>
            ))}
            
            {activeFilters.status.map(status => (
              <span 
                key={status}
                className="bg-pink-900/50 text-pink-300 text-xs px-2 py-1 rounded-full flex items-center"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <button 
                  className="ml-1"
                  onClick={() => onChange({...activeFilters, status: activeFilters.status.filter(s => s !== status)})}
                >
                  &times;
                </button>
              </span>
            ))}
            
            {activeFilters.studios.map(studio => (
              <span 
                key={studio}
                className="bg-pink-900/50 text-pink-300 text-xs px-2 py-1 rounded-full flex items-center"
              >
                {studio}
                <button 
                  className="ml-1"
                  onClick={() => toggleStudio(studio)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}