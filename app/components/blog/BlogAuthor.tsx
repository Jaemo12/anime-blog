'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLink } from 'react-icons/fa';

interface SocialLink {
  type: 'twitter' | 'github' | 'website' | 'other';
  url: string;
  label?: string;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  socialLinks?: SocialLink[];
  slug?: string;
}

interface BlogAuthorProps {
  author: Author;
  showBio?: boolean;
  showSocialLinks?: boolean;
  className?: string;
  variant?: 'card' | 'inline' | 'compact';
}

export default function BlogAuthor({
  author,
  showBio = true,
  showSocialLinks = true,
  className = '',
  variant = 'card'
}: BlogAuthorProps) {
  // Icon mapping for social links
  const getSocialIcon = (type: SocialLink['type']) => {
    switch (type) {
      case 'twitter':
        return <FaTwitter className="text-[#1DA1F2]" />;
      case 'github':
        return <FaGithub className="text-[#333]" />;
      case 'website':
      case 'other':
      default:
        return <FaLink className="text-[#8b5cf6]" />;
    }
  };
  
  // Variant: Compact (just name and avatar)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-6 h-6 rounded-full overflow-hidden relative flex-shrink-0 mr-2">
          <Image
            src={author.avatar || '/images/avatars/default.jpg'}
            alt={author.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <span className="text-sm text-gray-700">{author.name}</span>
      </div>
    );
  }
  
  // Variant: Inline (horizontal layout)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] p-0.5">
          <div className="rounded-full overflow-hidden w-full h-full">
            <Image
              src={author.avatar || '/images/avatars/default.jpg'}
              alt={author.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <div className="ml-3">
          <h3 className="font-bold text-base">
            {author.slug ? (
              <Link href={`/blog/authors/${author.slug}`} className="hover:text-[#8b5cf6] transition-colors">
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </h3>
          
          {author.role && (
            <p className="text-xs text-gray-500">{author.role}</p>
          )}
          
          {showSocialLinks && author.socialLinks && author.socialLinks.length > 0 && (
            <div className="flex space-x-2 mt-1">
              {author.socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs"
                  whileHover={{ scale: 1.2 }}
                  aria-label={link.label || link.type}
                >
                  {getSocialIcon(link.type)}
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default variant: Card (vertical layout)
  return (
    <div className={`p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-md ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] p-1">
          <div className="rounded-full overflow-hidden w-full h-full">
            <Image
              src={author.avatar || '/images/avatars/default.jpg'}
              alt={author.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">
            {author.slug ? (
              <Link href={`/blog/authors/${author.slug}`} className="hover:text-[#8b5cf6] transition-colors">
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </h3>
          
          {author.role && (
            <p className="text-sm text-[#8b5cf6] mb-3">{author.role}</p>
          )}
          
          {showBio && author.bio && (
            <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
          )}
          
          {showSocialLinks && author.socialLinks && author.socialLinks.length > 0 && (
            <div className="flex space-x-3 justify-center md:justify-start">
              {author.socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#8b5cf6]"
                  whileHover={{ scale: 1.2, y: -2 }}
                  aria-label={link.label || link.type}
                >
                  {getSocialIcon(link.type)}
                </motion.a>
              ))}
            </div>
          )}
          
          {author.slug && (
            <motion.div
              className="mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={`/blog/authors/${author.slug}`}
                className="px-4 py-2 bg-transparent border-2 border-[#8b5cf6] text-[#8b5cf6] rounded-md font-medium hover:bg-[#8b5cf6]/10 transition-all inline-block"
              >
                View Profile
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}