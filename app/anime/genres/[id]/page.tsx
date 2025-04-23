'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GradientText from '@/app/components/ui/GradientText';
import AnimeGrid from '@/app/components/anime/AnimeGrid';
import AnimeFilter from '@/app/components/anime/AnimeFilter';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Mock genre details data
const getGenreDetails = (id: string) => {
  const genres = {
    'cyberpunk': {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'High-tech dystopian futures featuring advanced technology, corporate control, and social unrest. Characterized by neon-lit cityscapes, human augmentation, and themes of identity in a technological world.',
      image: '/images/genres/cyberpunk.jpg',
      count: 94,
      related: ['sci-fi', 'psychological', 'action'],
      featured: true
    },
    'action': {
      id: 'action',
      name: 'Action',
      description: 'Fast-paced and adrenaline-pumping, featuring intense combat, physical challenges, and thrilling sequences. Often includes elaborate fight scenes, battles, and high-stakes confrontations.',
      image: '/images/genres/action.jpg',
      count: 423,
      related: ['adventure', 'sci-fi', 'fantasy'],
      featured: true
    },
    'romance': {
      id: 'romance',
      name: 'Romance',
      description: 'Emotional relationships, love stories, and the complexities of human connection and affection. These anime focus on the development of romantic relationships between characters.',
      image: '/images/genres/romance.jpg',
      count: 389,
      related: ['drama', 'slice-of-life', 'comedy'],
      featured: true
    }
  };
  
  // Default fallback for genres not in our mock data
  const defaultGenre = {
    id: id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    description: 'An anime genre with its own unique characteristics and storytelling conventions.',
    image: '/images/genres/default.jpg',
    count: 150,
    related: ['action', 'adventure', 'drama'],
    featured: false
  };
  
  return genres[id] || defaultGenre;
};

// Mock anime data for this genre
const ANIME_IN_GENRE = [
  {
    id: 1,
    title: 'Neon Nexus',
    image: '/images/anime/neon-nexus.jpg',
    rating: 9.2,
    genres: ['Cyberpunk', 'Action', 'Sci-Fi'],
    episodes: 24,
    studio: 'Future Vision',
    year: 2025,
    status: 'Airing'
  },
  {
    id: 5,
    title: 'Digital Dreamers',
    image: '/images/anime/digital-dreamers.jpg',
    rating: 9.0,
    genres: ['Cyberpunk', 'Virtual Reality', 'Adventure', 'Mystery'],
    episodes: 18,
    studio: 'Nexus Network',
    year: 2025,
    status: 'Airing'
  },
  {
    id: 10,
    title: 'Quantum Knights',
    image: '/images/anime/quantum-knights.jpg',
    rating: 9.3,
    genres: ['Cyberpunk', 'Sci-Fi', 'Action', 'Mystery'],
    episodes: 24,
    studio: 'Future Vision',
    year: 2025,
    status: 'Airing'
  },
  {
    id: 13,
    title: 'Neural Drift',
    image: '/images/anime/neural-drift.jpg',
    rating: 8.7,
    genres: ['Cyberpunk', 'Psychological', 'Sci-Fi'],
    episodes: 12,
    studio: 'Dark Frame',
    year: 2024,
    status: 'Completed'
  },
  {
    id: 17,
    title: 'Augmented Reality',
    image: '/images/anime/augmented-reality.jpg',
    rating: 8.9,
    genres: ['Cyberpunk', 'Sci-Fi', 'Drama'],
    episodes: 24,
    studio: 'Nexus Network',
    year: 2024,
    status: 'Completed'
  },
  {
    id: 23,
    title: 'Cyber Samurai',
    image: '/images/anime/cyber-samurai.jpg',
    rating: 9.1,
    genres: ['Cyberpunk', 'Action', 'Historical'],
    episodes: 13,
    studio: 'Temporal Arts',
    year: 2025,
    status: 'Airing'
  }
];

// Filter options
const FILTER_OPTIONS = {
  status: ['Airing', 'Completed', 'Upcoming'],
  year: ['2025', '2024', '2023', '2022', '2021', '2020', 'Older'],
  studios: [
    'Future Vision', 'Temporal Arts', 'Dream Canvas', 'Steel Vision', 
    'Nexus Network', 'Epic Realms', 'Mystery Box', 'Cosmic Canvas', 
    'Dark Frame', 'Spirit Tales'
  ]
};

export default function GenreDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState({
    status: [],
    year: [],
    studios: [],
    sortBy: 'popularity'
  });
  
  const genre = getGenreDetails(params.id);
  
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

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setActiveFilters(newFilters);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] mb-10">
        <Image
          src={genre.image}
          alt={genre.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GradientText
                as="h1"
                className="text-3xl md:text-5xl font-bold mb-4"
                from="cyan-400"
                to="pink-500"
              >
                {genre.name} Anime
              </GradientText>
              
              <p className="text-gray-300 max-w-3xl mb-4">
                {genre.description}
              </p>
              
              <div className="flex items-center text-sm text-gray-400">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-1"
                >
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
                {genre.count} anime in this genre
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Related Genres */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400">Related Genres:</span>
            {genre.related.map(relatedId => (
              <Link 
                key={relatedId}
                href={`/anime/genres/${relatedId}`}
                className="px-3 py-1 text-sm rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {relatedId.charAt(0).toUpperCase() + relatedId.slice(1)}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <AnimeFilter 
                options={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-gray-300">
                Showing <span className="text-white font-medium">{ANIME_IN_GENRE.length}</span> results
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-300">Sort by:</label>
                <select 
                  id="sort"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={activeFilters.sortBy}
                  onChange={(e) => handleFilterChange({...activeFilters, sortBy: e.target.value})}
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
            
            {/* Anime Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="xl" />
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimeGrid anime={ANIME_IN_GENRE} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}