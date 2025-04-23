'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import GradientText from '../ui/GradientText';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  publishDate: string;
  views?: number;
  likes?: number;
}

interface PopularPostsProps {
  posts: BlogPost[];
  title?: string;
  count?: number;
  className?: string;
  sortBy?: 'views' | 'likes' | 'date';
}

export default function PopularPosts({
  posts,
  title = 'Popular Posts',
  count = 5,
  className = '',
  sortBy = 'views'
}: PopularPostsProps) {
  // Sort posts based on sortBy
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    
    // Sort by date (newest first)
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  }).slice(0, count);
  
  return (
    <div className={`p-6 rounded-xl bg-white/60 backdrop-blur-sm shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-4">
        <GradientText>{title}</GradientText>
      </h3>
      
      {sortedPosts.length === 0 ? (
        <p className="text-gray-500 text-sm">No posts available</p>
      ) : (
        <ul className="space-y-4">
          {sortedPosts.map(post => (
            <li key={post.id} className="flex gap-3 group">
              <Link href={`/blog/${post.slug}`} className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image 
                  src={post.coverImage || '/images/placeholder.jpg'} 
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Link>
              
              <div className="flex-grow">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#8b5cf6] transition-colors">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <FaCalendarAlt className="mr-1 text-[#8b5cf6]" />
                    {post.publishDate}
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}