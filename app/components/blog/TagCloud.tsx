'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import GradientText from '../ui/GradientText';

interface Tag {
  name: string;
  count?: number;
}

interface TagCloudProps {
  tags: Tag[];
  onSelectTag?: (tag: string) => void;
  title?: string;
  maxTags?: number;
  className?: string;
}

export default function TagCloud({
  tags,
  onSelectTag,
  title = 'Popular Tags',
  maxTags = 20,
  className = ''
}: TagCloudProps) {
  // Sort tags by count if available
  const sortedTags = useMemo(() => {
    if (tags.length === 0) return [];
    
    // If counts exist, sort by count (descending)
    if (tags[0].count !== undefined) {
      return [...tags]
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, maxTags);
    }
    
    // Otherwise just take the first maxTags
    return tags.slice(0, maxTags);
  }, [tags, maxTags]);
  
  // Calculate size based on count (if available)
  const getTagSize = (tag: Tag) => {
    if (tag.count === undefined) return 'text-xs';
    
    const maxCount = Math.max(...tags.map(t => t.count || 0));
    const minCount = Math.min(...tags.map(t => t.count || 0));
    
    // Range between 0 and 1
    const normalized = maxCount === minCount 
      ? 0.5 
      : (tag.count - minCount) / (maxCount - minCount);
    
    // Map to size classes
    if (normalized < 0.2) return 'text-xs';
    if (normalized < 0.4) return 'text-sm';
    if (normalized < 0.6) return 'text-base';
    if (normalized < 0.8) return 'text-lg';
    return 'text-xl';
  };
  
  return (
    <div className={`p-6 rounded-xl bg-white/60 backdrop-blur-sm shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-4">
        <GradientText>{title}</GradientText>
      </h3>
      
      {sortedTags.length === 0 ? (
        <p className="text-gray-500 text-sm">No tags available</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag, idx) => (
            <motion.button
              key={idx}
              className={`bg-white/80 px-3 py-1 rounded-full ${getTagSize(tag)} font-medium text-[#8b5cf6] border border-[#d8b4fe]/30 hover:bg-[#8b5cf6]/10 transition-colors`}
              onClick={() => onSelectTag && onSelectTag(tag.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              #{tag.name}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}