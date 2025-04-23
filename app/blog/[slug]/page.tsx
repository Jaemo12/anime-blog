'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostBySlug, incrementViewCount, getPostsByCategory, BlogPost } from '@/app/lib/blogServices';

// Animation variants with enhanced effects
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      delay: 0.2
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

// Interface for Author
interface Author {
  name: string;
  image?: string;
  bio?: string;
}

// Shimmer effect for images
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Layout components
const ModernBackground = () => (
  <div className="fixed inset-0 overflow-hidden -z-10 bg-gradient-to-br from-slate-50 to-indigo-50">
    {/* Abstract shapes */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-400 rounded-full opacity-10 blur-3xl"></div>
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500 rounded-full opacity-10 blur-3xl"></div>
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
    
    {/* Animated gradient orbs */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-10 right-0 w-72 h-72 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>
);

const TagBadge = ({ tag }: { tag: string }) => (
  <motion.span
    whileHover={{ y: -3, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 shadow-sm hover:shadow-md transition-all border border-indigo-100/50"
  >
    #{tag}
  </motion.span>
);

const CategoryBadge = ({ category }: { category: string }) => (
  <motion.span
    whileHover={{ y: -2 }}
    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm"
  >
    {category}
  </motion.span>
);

const AuthorCard = ({ author }: { author: Author }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="flex items-center space-x-4"
  >
    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md">
      <Image 
        src={author.image || '/images/avatars/default.jpg'} 
        alt={author.name}
        fill
        sizes="48px"
        className="object-cover"
      />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{author.name}</h4>
      <p className="text-sm text-gray-600">{author.bio || 'Content Creator'}</p>
    </div>
  </motion.div>
);

const ShareButtons = ({ title, slug }: { title: string; slug: string }) => {
  const url = `https://yoursite.com/blog/${slug}`;
  
  return (
    <motion.div 
      className="flex space-x-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.a
        variants={itemFade}
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#1DA1F2] text-white"
        aria-label="Share on Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </motion.a>
      <motion.a
        variants={itemFade}
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(59, 89, 152, 0.4)" }}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#1877F2] text-white"
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </motion.a>
      <motion.a
        variants={itemFade}
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(10, 102, 194, 0.4)" }}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#0A66C2] text-white"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </motion.a>
      <motion.button
        variants={itemFade}
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(17, 24, 39, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
        }}
        className="p-2 rounded-full bg-gray-800 text-white"
        aria-label="Copy link"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

const TableOfContents = ({ content }: { content: string }) => {
  // Extract headings from content (assuming h2 and h3 tags)
  const headings: {id: string, text: string, level: number}[] = [];
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/g;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, ''); // Remove any HTML inside heading
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    
    headings.push({ id, text, level });
  }
  
  if (headings.length === 0) return null;
  
  return (
    <motion.div 
      className="p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold mb-4 text-violet-900">Table of Contents</h3>
      <motion.ul 
        className="space-y-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {headings.map((heading, index) => (
          <motion.li 
            key={index} 
            className={`${heading.level === 3 ? 'pl-4' : ''}`}
            variants={itemFade}
          >
            <a 
              href={`#${heading.id}`}
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors flex items-center group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 group-hover:bg-indigo-600 transition-colors"></span>
              {heading.text}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

const RelatedPostCard = ({ post }: { post: BlogPost }) => (
  <motion.div 
    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <Link href={`/blog/${post.slug}`}>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.coverImage || '/images/placeholder.jpg'}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 text-lg">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </div>
          <div className="flex items-center space-x-1">
            {post.categories?.slice(0, 1).map(category => (
              <span key={category} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Modified ReadingProgressBar component
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setProgress(Math.min((scrollTop / scrollHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div 
        className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Helper function to format date
const formatDate = (date: any): string => {
  if (!date) return 'Unknown date';
  
  try {
    let dateObj;
    if (typeof date === 'object' && date?.toDate) {
      dateObj = date.toDate();
    } else if (date._seconds !== undefined && date._nanoseconds !== undefined) {
      // Handle Firestore timestamp in JSON format
      dateObj = new Date(date._seconds * 1000);
    } else {
      dateObj = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return 'Unknown date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
};

// Calculate reading time (5 mins is default)
const getReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute) || 5;
};

// Format content to add IDs to headings for Table of Contents
const formatContent = (content: string): string => {
  if (!content) return '';
  
  return content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
};

// Main component - fixed the params issue using React.use()
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Properly unwrap params
  const slug = params.slug; // Next.js currently allows this direct access
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch post and related content
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Fetching post with slug:', slug);
        
        // Use the blogService function instead of direct Firestore queries
        const postData = await getPostBySlug(slug);
        
        if (!postData) {
          console.error('Post not found with slug:', slug);
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        console.log('Post data retrieved:', postData);
        
        // Calculate reading time if not provided
        if (!postData.readTime) {
          postData.readTime = getReadingTime(postData.content);
        }
        
        // Ensure categories is always an array
        if (!postData.categories || !Array.isArray(postData.categories)) {
          console.warn('Post has no categories array, initializing empty array');
          postData.categories = [];
        }
        
        // Ensure author object exists
        if (!postData.author) {
          console.warn('Post has no author object, initializing default');
          postData.author = {
            name: 'Anonymous',
            image: '/images/avatars/default.jpg'
          };
        }
        
        setPost(postData);
        
        // Increment view count
        if (postData.id) {
          incrementViewCount(postData.id).catch(err => 
            console.error('Failed to increment view count:', err)
          );
        }
        
        // Fetch related posts based on categories
        if (postData.categories && postData.categories.length > 0) {
          const category = postData.categories[0];
          const relatedData = await getPostsByCategory(category);
          
          // Filter out the current post from related posts
          const filteredRelatedPosts = relatedData
            .filter(p => p.slug !== slug)
            .slice(0, 3);
          
          setRelatedPosts(filteredRelatedPosts);
        }
        
        // Fetch recent posts using the blogService
        const recentData = await getPostsByCategory(''); // Empty string to get all posts
        
        // Filter out the current post and get most recent
        const filteredRecentPosts = recentData
          .filter(p => p.slug !== slug)
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);
        
        setRecentPosts(filteredRecentPosts);
        
      } catch (error: any) {
        console.error('Error fetching post:', error);
        setError(`Failed to load post: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [slug]); // Dependency is now just slug
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-solid animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-4 border-t-pink-500 border-solid animate-spin animation-delay-500"></div>
            <div className="absolute inset-6 rounded-full border-4 border-t-purple-500 border-solid animate-spin animation-delay-1000"></div>
          </div>
          <p className="mt-6 text-indigo-700 font-medium text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <svg className="w-24 h-24 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Oops! Article Not Found</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error || "We couldn't find the article you're looking for."}</p>
        <motion.button 
          onClick={() => router.push('/blog')} 
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/20"
          whileHover={{ y: -3, boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Blog
        </motion.button>
      </div>
    );
  }
  
  return (
    <main className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 min-h-screen overflow-x-hidden">
      <ReadingProgressBar />
      <ModernBackground />
      
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-[75vh] sm:h-[85vh] relative">
          <Image
            src={post.coverImage || '/images/placeholder.jpg'}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-transparent mix-blend-multiply"></div>
        </div>
        
        {/* Post Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring",
                stiffness: 50,
                damping: 15
              }}
            >
              <motion.div 
                className="flex flex-wrap gap-3 mb-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {post.categories?.map(category => (
                  <motion.div key={category} variants={itemFade}>
                    <CategoryBadge category={category} />
                  </motion.div>
                ))}
                
                <motion.span 
                  variants={itemFade}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {post.readTime} min read
                </motion.span>
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white max-w-4xl leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <AuthorCard author={post.author} />
                  <span className="text-white/80 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                
                <div className="text-white bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                  <ShareButtons title={post.title} slug={post.slug} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Area */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Excerpt - Redesigned with gradient and glass effect */}
            {post.excerpt && (
              <motion.div 
                className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-l-4 border-indigo-500"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
              </motion.div>
            )}
            
            {/* Article Content - Enhanced styling */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10 mb-10 prose prose-lg max-w-none 
                prose-img:rounded-xl prose-img:shadow-md
                prose-headings:text-indigo-900 prose-headings:font-bold 
                prose-a:text-indigo-600 prose-a:font-medium prose-a:underline-offset-2 
                prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50/80 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                prose-strong:text-indigo-700
                prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
            
            {/* Tags - Enhanced with animation */}
            <motion.div 
              className="mb-10"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Tags
              </h3>
              <motion.div 
                className="flex flex-wrap gap-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {post.categories?.map(tag => (
                  <motion.div key={tag} variants={itemFade}>
                    <TagBadge tag={tag} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Author Bio (Mobile) */}
            <div className="lg:hidden mb-10">
              <motion.div 
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  About the Author
                </h3>
                <AuthorCard author={post.author} />
                <p className="mt-4 text-gray-600">
                  {post.author.bio || 'Anime enthusiast and content creator passionate about sharing insights into the world of Japanese animation.'}
                </p>
              </motion.div>
            </div>
            
            {/* Related Posts - Enhanced with animation */}
            {relatedPosts.length > 0 && (
              <motion.div 
                className="mb-16"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Related Articles
                </h3>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {relatedPosts.map(post => (
                    <motion.div key={post.id} variants={itemFade}>
                      <RelatedPostCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Sidebar - Enhanced with glass morphism */}
          <motion.div 
            className="lg:w-1/3"
            variants={slideRight}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <TableOfContents content={post.content} />
              
              {/* Author Bio (Desktop) */}
              <motion.div 
                className="hidden lg:block p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  About the Author
                </h3>
                <AuthorCard author={post.author} />
                <p className="mt-4 text-gray-600">
                  {post.author.bio || 'Anime enthusiast and content creator passionate about sharing insights into the world of Japanese animation.'}
                </p>
              </motion.div>
              
              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <motion.div 
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2m-2-6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8m0 0l-4-4m4 4l-4 4"></path>
                    </svg>
                    Recent Articles
                  </h3>
                  <motion.div 
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {recentPosts.map(post => (
                      <motion.div key={post.id} variants={itemFade}>
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="group flex gap-3 p-2 rounded-lg hover:bg-indigo-50/50 transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 shadow-md">
                            <Image
                              src={post.coverImage || '/images/placeholder.jpg'}
                              alt={post.title}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <svg className="w-3 h-3 mr-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              {formatDate(post.createdAt)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
              
              {/* Newsletter Signup */}
              <motion.div 
                className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white overflow-hidden relative"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full"></div>
                
                <h3 className="text-xl font-semibold mb-3 relative">Stay Updated</h3>
                <p className="mb-4 text-white/90 relative">Get the latest anime articles delivered to your inbox</p>
                <form className="space-y-3 relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90 backdrop-blur-sm"
                  />
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Subscribe
                  </motion.button>
                </form>
                <p className="mt-3 text-xs text-white/70 relative">We respect your privacy. Unsubscribe anytime.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Back to blog button */}
      <div className="container mx-auto max-w-7xl px-4 py-8 mb-20">
        <Link href="/blog">
          <motion.button
            whileHover={{ x: -5, boxShadow: "0 5px 15px -3px rgba(79, 70, 229, 0.3)" }}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to all articles
          </motion.button>
        </Link>
      </div>
      
      {/* Back to top button - Enhanced with glass effect */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.4)" }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg transition-all backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </motion.button>
      </div>
    </main>
  );
}