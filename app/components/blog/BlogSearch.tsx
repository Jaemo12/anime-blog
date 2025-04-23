'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

interface BlogSearchProps {
  onSearch: (filters: {
    searchTerm: string;
    category?: string | null;
    sortBy?: 'recent' | 'popular' | 'oldest';
  }) => void;
  categories?: Category[];
  defaultSearchTerm?: string;
  defaultCategory?: string | null;
  defaultSortBy?: 'recent' | 'popular' | 'oldest';
  showFilters?: boolean;
  className?: string;
}

export default function BlogSearch({
  onSearch,
  categories = [],
  defaultSearchTerm = '',
  defaultCategory = null,
  defaultSortBy = 'recent',
  showFilters = true,
  className = ''
}: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [category, setCategory] = useState(defaultCategory);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>(defaultSortBy);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSearch({
      searchTerm,
      category,
      sortBy
    });
  };
  
  // Handle filter toggle
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategory(null);
    setSortBy('recent');
    
    onSearch({
      searchTerm: '',
      category: null,
      sortBy: 'recent'
    });
  };
  
  // Animation variants for filters panel
  // Animation variants for filters panel
  const filtersVariants = {
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
  
  return (
    <div className={`p-6 rounded-xl bg-white/60 backdrop-blur-sm shadow-md ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b5cf6]" />
          </div>
          
          {showFilters && (
            <div className="flex space-x-2">
              <motion.button
                type="button"
                className={`px-4 py-3 rounded-md flex items-center justify-center ${
                  isFiltersOpen || category || sortBy !== 'recent'
                    ? 'bg-[#8b5cf6] text-white'
                    : 'bg-white/80 text-[#8b5cf6] border border-[#d8b4fe]/30'
                }`}
                onClick={toggleFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFilter className="mr-2" />
                Filters
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white font-medium rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.button>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={filtersVariants}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category || ''}
                    onChange={(e) => setCategory(e.target.value || null)}
                    className="w-full px-4 py-2 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'oldest')}
                    className="w-full px-4 py-2 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center text-sm text-gray-500 hover:text-[#8b5cf6]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes className="mr-1" />
                    Clear Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!showFilters && (
          <button type="submit" className="sr-only">
            Search
          </button>
        )}
      </form>
    </div>
  );
}