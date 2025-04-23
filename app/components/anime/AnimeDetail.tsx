'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchAnimeById } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import GradientText from '@/app/components/ui/GradientText';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Shimmer loading effect component
const ShimmerEffect = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-lavender-100 via-pink-50 to-lavender-100 bg-[length:400%_100%] ${className}`}></div>
);

// Anime Detail Page
export default function AnimeDetailPage({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'related'>('overview');
  
  useEffect(() => {
    const loadAnimeDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAnimeById(Number(params.id));
        setAnime(data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Could not load anime details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnimeDetails();
  }, [params.id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-pink-50 to-white pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          {/* Loading UI with shimmer effects */}
          <div className="w-full h-[40vh] relative rounded-3xl overflow-hidden mb-16">
            <ShimmerEffect className="absolute inset-0" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <ShimmerEffect className="w-full aspect-[2/3] rounded-2xl" />
            </div>
            
            <div className="lg:w-3/4 space-y-8">
              <ShimmerEffect className="h-12 w-3/4 rounded-lg" />
              <ShimmerEffect className="h-6 w-1/2 rounded-lg" />
              <div className="space-y-4">
                <ShimmerEffect className="h-4 w-full rounded-lg" />
                <ShimmerEffect className="h-4 w-full rounded-lg" />
                <ShimmerEffect className="h-4 w-2/3 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oh no!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            variant="primary"
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Anime Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the anime you're looking for.</p>
          <Link href="/anime/trending">
            <Button 
              variant="primary"
              className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
            >
              Explore Trending Anime
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Define a function to get a pastel color for genres
  const getGenreColor = (index: number) => {
    const colors = [
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-violet-100 text-violet-700 border-violet-200',
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
    ];
    return colors[index % colors.length];
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-lavender-50 via-pink-50 to-white pt-20 pb-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-lavender-100/30 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Hero Banner */}
        <div className="relative w-full h-[40vh] rounded-3xl overflow-hidden shadow-lg mb-16">
          {/* Abstract gradient background as placeholder if no image */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-300/40 via-pink-300/40 to-rose-300/40"></div>
          
          {/* Actual image with overlay */}
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            priority
            className="object-cover object-center opacity-80"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-lavender-700/60 to-transparent"></div>
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                {anime.title}
              </h1>
            </motion.div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Poster and Info */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl shadow-lg border-4 border-white"
              >
                <Image
                  src={anime.image}
                  alt={anime.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                
                {/* Rating badge */}
                {anime.rating > 0 && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 rounded-full text-white font-bold shadow-md flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{anime.rating.toFixed(1)}</span>
                  </div>
                )}
              </motion.div>
              
              {/* Quick Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                  Information
                </h3>
                
                <div className="space-y-3">
                  {/* Type */}
                  <div className="flex">
                    <span className="w-24 text-gray-500">Type:</span>
                    <span className="font-medium text-gray-800">{anime.type || "Unknown"}</span>
                  </div>
                  
                  {/* Episodes */}
                  {anime.episodes && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Episodes:</span>
                      <span className="font-medium text-gray-800">{anime.episodes}</span>
                    </div>
                  )}
                  
                  {/* Status */}
                  {anime.status && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Status:</span>
                      <span className="font-medium text-gray-800">{anime.status}</span>
                    </div>
                  )}
                  
                  {/* Duration */}
                  {anime.duration && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-800">{anime.duration}</span>
                    </div>
                  )}
                  
                  {/* Season */}
                  {anime.season && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Season:</span>
                      <span className="font-medium text-gray-800">{anime.season}</span>
                    </div>
                  )}
                  
                  {/* Studios */}
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Studios:</span>
                      <div className="font-medium text-gray-800">
                        {anime.studios.map((studio: string, i: number) => (
                          <React.Fragment key={studio}>
                            <Link 
                              href={`/anime/studios/${studio.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                            >
                              {studio}
                            </Link>
                            {i < anime.studios.length - 1 && ", "}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col gap-3"
              >
                <Button 
                  variant="primary"
                  className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 shadow-md"
                  fullWidth
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Watch Now
                </Button>
                
                <Button 
                  variant="secondary"
                  className="bg-white text-violet-600 hover:text-violet-800 border border-violet-200 shadow-sm"
                  fullWidth
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  Add to Watchlist
                </Button>
                
                <Button 
                  variant="outline"
                  className="text-rose-500 hover:text-rose-700 border border-rose-200"
                  fullWidth
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  Add to Favorites
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="lg:w-3/4">
            {/* Tabs */}
            <div className="mb-8 border-b border-lavender-200/50">
              <div className="flex space-x-8">
                <button
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-violet-600 border-b-2 border-violet-500'
                      : 'text-gray-500 hover:text-violet-500'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                
                {anime.characters && anime.characters.length > 0 && (
                  <button
                    className={`pb-3 px-1 font-medium transition-colors ${
                      activeTab === 'characters'
                        ? 'text-violet-600 border-b-2 border-violet-500'
                        : 'text-gray-500 hover:text-violet-500'
                    }`}
                    onClick={() => setActiveTab('characters')}
                  >
                    Characters
                  </button>
                )}
                
                <button
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'related'
                      ? 'text-violet-600 border-b-2 border-violet-500'
                      : 'text-gray-500 hover:text-violet-500'
                  }`}
                  onClick={() => setActiveTab('related')}
                >
                  Related
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[60vh]">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Genres */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.map((genre: string, index: number) => (
                          <Link 
                            key={genre} 
                            href={`/anime/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div className={`px-4 py-2 rounded-full border text-sm font-medium transition-transform hover:scale-105 ${getGenreColor(index)}`}>
                              {genre}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Synopsis */}
                  <div className="mb-10">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                      Synopsis
                    </h3>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {anime.synopsis}
                      </p>
                    </div>
                  </div>
                
                  {/* Additional Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 text-violet-600">Airing Information</h3>
                      <div className="space-y-2">
                        {anime.status && (
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              anime.status === 'Airing' ? 'bg-green-400' :
                              anime.status === 'Finished Airing' ? 'bg-blue-400' :
                              'bg-yellow-400'
                            }`}></div>
                            <span className="font-medium">{anime.status}</span>
                          </div>
                        )}
                        {anime.aired && (
                          <div className="text-gray-600">
                            {anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : ''} 
                            {anime.aired.to ? ` to ${anime.aired.to === 'Present' ? 'Present' : new Date(anime.aired.to).toLocaleDateString()}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 text-pink-600">Popularity</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <div>
                            <div className="font-bold text-2xl">{anime.rating.toFixed(1)}</div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <div>
                            <div className="font-bold text-2xl">10.2k</div>
                            <div className="text-xs text-gray-500">Views</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Characters Tab */}
              {activeTab === 'characters' && anime.characters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Characters
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {anime.characters.map((character: any) => (
                      <motion.div 
                        key={character.id}
                        whileHover={{ y: -5 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md group"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={character.image}
                            alt={character.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="text-white text-xs font-medium px-2 py-0.5 rounded-full inline-block" 
                                 style={{ 
                                   backgroundColor: character.role === 'Main' ? 'rgba(244, 114, 182, 0.8)' : 
                                                   character.role === 'Supporting' ? 'rgba(139, 92, 246, 0.8)' : 
                                                   'rgba(45, 212, 191, 0.8)' 
                                 }}>
                              {character.role}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-medium text-gray-800 mb-1">{character.name}</h4>
                          {character.voiceActor && (
                            <p className="text-sm text-gray-500">VA: {character.voiceActor}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Related Tab */}
              {activeTab === 'related' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Coming Soon!</h3>
                    <p className="text-gray-600 mb-6">
                      We're currently gathering information about related anime. Check back soon!
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setActiveTab('overview')}
                      className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
                    >
                      Back to Overview
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};