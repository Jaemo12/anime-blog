'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
  badges?: string[];
  footer?: React.ReactNode;
  className?: string;
  imageHeight?: string;
  hoverEffect?: boolean;
}

export default function Card({
  title,
  image,
  description,
  link,
  badges = [],
  footer,
  className = '',
  imageHeight = 'h-56',
  hoverEffect = true
}: CardProps) {
  const CardContent = () => (
    <div className={`relative bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden h-full shadow-sm transition-all border border-white/30 ${className} ${hoverEffect ? 'group-hover:shadow-md' : ''}`}>
      <div className={`relative ${imageHeight}`}>
        <div className="w-full h-full bg-[#f3f0ff] animate-pulse"></div>
        <Image 
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-0 right-0 flex flex-wrap gap-2 p-3 max-w-[80%] justify-end">
            {badges.map((badge, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] px-2 py-1 rounded-md text-xs font-medium text-white"
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-6 relative">
        <h3 className={`font-bold text-xl mb-3 ${hoverEffect ? 'group-hover:text-[#8b5cf6] transition-colors' : ''}`}>
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        {footer && (
          <div className="mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with motion div for animation
  const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div 
      className={`relative ${hoverEffect ? 'group' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hoverEffect ? { y: -5 } : {}}
    >
      {children}
    </motion.div>
  );

  // If link is provided, wrap with Link
  if (link) {
    return (
      <MotionWrapper>
        <Link href={link}>
          <CardContent />
        </Link>
      </MotionWrapper>
    );
  }

  // Otherwise, render without Link
  return (
    <MotionWrapper>
      <CardContent />
    </MotionWrapper>
  );
}