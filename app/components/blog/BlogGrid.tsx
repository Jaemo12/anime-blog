'use client';

import { ReactNode } from 'react';
import BlogPostCard from './BlogPostCard';
import GradientText from '../ui/GradientText';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  publishDate: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: string[];
  likes?: number;
  views?: number;
  featured?: boolean;
}

interface BlogGridProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  featuredLayout?: boolean;
  showFeaturedPosts?: boolean;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  emptyMessage?: string | ReactNode;
}

export default function BlogGrid({ 
  posts,
  title,
  subtitle,
  featuredLayout = false,
  showFeaturedPosts = true,
  className = '',
  columns = 2,
  emptyMessage = 'No posts found'
}: BlogGridProps) {
  // Filter featured posts if needed
  const featuredPosts = showFeaturedPosts ? posts.filter(post => post.featured) : [];
  
  // Rest of the posts (if featuredLayout is true and there are featured posts)
  const regularPosts = featuredLayout && featuredPosts.length > 0
    ? posts.filter(post => !post.featured)
    : posts;
  
  // Determine column classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  // If there are no posts
  if (posts.length === 0) {
    return (
      <div className={`p-8 rounded-xl bg-white/60 backdrop-blur-sm shadow-md text-center ${className}`}>
        {typeof emptyMessage === 'string' ? (
          <p className="text-gray-600">{emptyMessage}</p>
        ) : (
          emptyMessage
        )}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Title Section */}
      {title && (
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-bold">
              <GradientText>{title}</GradientText>
            </h2>
            <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
          </div>
          
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Featured Posts Section */}
      {featuredLayout && featuredPosts.length > 0 && (
        <div className="mb-10">
          {!title && (
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">
                <GradientText>Featured</GradientText> Posts
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {featuredPosts.slice(0, 1).map(post => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                featured={true} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <>
          {featuredLayout && featuredPosts.length > 0 && !title && (
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">
                <GradientText>Latest</GradientText> Posts
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
            </div>
          )}
          
          <div className={`grid ${columnClasses[columns]} gap-6`}>
            {regularPosts.map(post => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}