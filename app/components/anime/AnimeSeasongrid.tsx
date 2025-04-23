'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaSnowflake, FaLeaf, FaSun, FaCanadianMapleLeaf } from 'react-icons/fa';
import GradientText from '../ui/GradientText';

interface Season {
  year: number;
  season: 'winter' | 'spring' | 'summer' | 'fall';
  animeCount?: number;
}

interface AnimeSeasonsGridProps {
  seasons: Season[];
  currentYear?: number;
  currentSeason?: 'winter' | 'spring' | 'summer' | 'fall';
  className?: string;
}

export default function AnimeSeasonsGrid({
  seasons,
  currentYear,
  currentSeason,
  className = ''
}: AnimeSeasonsGridProps) {
  // Group seasons by year
  const groupedSeasons: Record<number, Season[]> = {};
  
  seasons.forEach(season => {
    if (!groupedSeasons[season.year]) {
      groupedSeasons[season.year] = [];
    }
    groupedSeasons[season.year].push(season);
  });
  
  // Sort years descending
  const sortedYears = Object.keys(groupedSeasons)
    .map(Number)
    .sort((a, b) => b - a);
  
  // Get season icon
  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'winter':
        return <FaSnowflake className="text-blue-400" />;
      case 'spring':
        return <FaLeaf className="text-green-400" />;
      case 'summer':
        return <FaSun className="text-yellow-400" />;
      case 'fall':
        return <FaCanadianMapleLeaf className="text-orange-400" />;
      default:
        return null;
    }
  };
  
  // Get season color
  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'winter':
        return 'from-blue-500 to-indigo-500';
      case 'spring':
        return 'from-green-500 to-emerald-400';
      case 'summer':
        return 'from-yellow-400 to-amber-500';
      case 'fall':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-[#8b5cf6] to-[#e879f9]';
    }
  };
  
  // Check if a season is the current one
  const isCurrentSeason = (year: number, season: string) => {
    return currentYear === year && currentSeason === season;
  };
  
  return (
    <div className={className}>
      <div className="space-y-10">
        {sortedYears.map(year => (
          <div key={year}>
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">
                <GradientText>{year}</GradientText> Seasons
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['winter', 'spring', 'summer', 'fall'].map(season => {
                // Find the season data
                const seasonData = groupedSeasons[year].find(s => s.season === season);
                
                // Skip if season doesn't exist
                if (!seasonData) return null;
                
                return (
                  <motion.div
                    key={`${year}-${season}`}
                    className="relative"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link 
                      href={`/anime/seasons/${year}/${season}`}
                      className="block h-full"
                    >
                      <div className={`
                        bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md h-full
                        ${isCurrentSeason(year, season) ? 'ring-2 ring-[#8b5cf6]' : ''}
                      `}>
                        <div className={`h-2 bg-gradient-to-r ${getSeasonColor(season)}`}></div>
                        
                        <div className="p-6 flex flex-col items-center text-center">
                          <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#e879f9]/10 p-3 rounded-full mb-3">
                            <div className="text-2xl">
                              {getSeasonIcon(season)}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold capitalize mb-1">
                            {season}
                          </h3>
                          
                          {seasonData.animeCount !== undefined && (
                            <p className="text-sm text-gray-500">
                              {seasonData.animeCount} anime
                            </p>
                          )}
                          
                          {isCurrentSeason(year, season) && (
                            <div className="mt-3 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white text-xs px-2 py-1 rounded-full">
                              Current Season
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}