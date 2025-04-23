'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Anime {
  id: string | number;
  title: string;
  image: string;
  score?: number;
  genres?: string[];
  studios?: string[];
  episodes?: number;
  year?: number;
  season?: string;
}

interface AnimeCardProps {
  anime: Anime;
  variant?: 'default' | 'featured';
  className?: string;
  titleClassName?: string;
  genreClassName?: string;
  ratingClassName?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  variant = 'default',
  className = '',
  titleClassName = '',
  genreClassName = '',
  ratingClassName = ''
}) => {
  // Check if anime exists before destructuring
  if (!anime) {
    console.error('AnimeCard received undefined anime data');
    return null;
  }

  const { id, title, image, score, genres } = anime;

  return (
    <Link href={`/anime/${id}`} className="block">
      <motion.div
        whileHover={{ y: -8 }}
        className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Image */}
          <Image
            src={image || '/images/placeholder-anime.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Rating badge */}
          {score && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
              ★ {score.toFixed(1)}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className={`font-bold text-slate-800 mb-2 line-clamp-2 ${titleClassName}`}>
            {title}
          </h3>
          
          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-2 ${genreClassName}`}>
              {genres.slice(0, 3).map((genre, index) => (
                <span
                  key={`${id}-genre-${index}`}
                  className="text-xs bg-lavender-100 text-purple-600 px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default AnimeCard;