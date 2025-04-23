'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Author {
  name: string;
  avatar: string;
}

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  publishedAt: string;
  author: Author;
  category: string;
  readTime: number;
  variant?: 'default' | 'featured' | 'minimal';
  slug: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  excerpt,
  cover,
  publishedAt,
  author,
  category,
  readTime,
  variant = 'default',
  slug
}) => {
  // Function to validate and process image URLs
  const getValidImageUrl = (url: string): string => {
    // Check if URL is valid
    if (!url || url === 'asd' || (!url.startsWith('/') && !url.startsWith('http'))) {
      // Return placeholder based on the type of image
      if (url === author?.avatar) {
        return '/images/avatars/default.jpg';
      }
      return '/images/placeholders/post-placeholder.jpg';
    }
    return url;
  };

  // Safe date formatting
  const formatPublishDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return 'Recently';
    }
  };

  // Handle different card variants
  switch (variant) {
    case 'featured':
      return (
        <div className="overflow-hidden h-full flex flex-col group">
          {/* Image container with relative positioning */}
          <div className="relative h-48 md:h-60 overflow-hidden">
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
            
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={getValidImageUrl(cover)}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={true}
              />
            </div>
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 z-20">
              <Link href={`/blog/categories/${category.toLowerCase()}`}>
                <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-indigo-600 hover:bg-white transition-colors shadow-sm">
                  {category}
                </span>
              </Link>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-grow p-6 bg-white">
            <Link href={`/blog/${slug}`} className="block group">
              <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {excerpt}
            </p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200">
                  <Image 
                    src={getValidImageUrl(author.avatar)}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700">{author.name}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                {readTime} min read
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'minimal':
      return (
        <div className="flex items-start gap-4 group">
          {/* Small thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={getValidImageUrl(cover)}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <Link href={`/blog/${slug}`} className="block group">
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                {title}
              </h3>
            </Link>
            
            <div className="flex text-xs text-gray-500 gap-3">
              <span>{formatPublishDate(publishedAt)}</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="overflow-hidden rounded-xl group h-full flex flex-col bg-white shadow-sm border border-gray-100">
          {/* Image container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={getValidImageUrl(cover)}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Content */}
          <div className="p-5 flex-grow flex flex-col">
            <div className="flex items-center mb-3">
              <Link href={`/blog/categories/${category.toLowerCase()}`}>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {category}
                </span>
              </Link>
              <span className="text-gray-400 text-xs ml-auto">
                {formatPublishDate(publishedAt)}
              </span>
            </div>
            
            <Link href={`/blog/${slug}`} className="block group flex-grow">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {title}
              </h3>
            
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {excerpt}
              </p>
            </Link>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                  <Image 
                    src={getValidImageUrl(author.avatar)}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700">{author.name}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                {readTime} min read
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default BlogPostCard;