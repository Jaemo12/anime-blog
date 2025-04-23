'use client';

import React, { useEffect, useState } from 'react';
import { fetchAnimeById } from '@/app/lib/api';
import AnimeDetailPage from '@/app/components/anime/AnimeDetail';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Shimmer loading effect component
const ShimmerEffect = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-lavender-100 via-pink-50 to-lavender-100 bg-[length:400%_100%] ${className}`}></div>
);

export default function AnimePage({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAnimeDetails = async () => {
      if (!params?.id) return; // Check if params.id exists before using it
      
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
  }, [params?.id]); // Use optional chaining to prevent the error
  
  // Return loading spinner while loading, otherwise return the main content
  if (isLoading) {
    return <LoadingSpinner />;
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
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-medium rounded-full shadow-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
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
          <a 
            href="/anime/trending"
            className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-medium rounded-full shadow-md inline-block"
          >
            Explore Trending Anime
          </a>
        </div>
      </div>
    );
  }
  
  // If we have successfully loaded the anime data, render the AnimeDetailPage component
  return <AnimeDetailPage params={{ id: params.id }} />;
}