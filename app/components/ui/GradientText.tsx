'use client';

import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'default' | 'purple-pink' | 'blue-purple';
}

export default function GradientText({ 
  children, 
  className = "",
  gradient = 'default'
}: GradientTextProps) {
  // Different gradient options
  const gradientClasses = {
    default: 'from-[#8b5cf6] via-[#d946ef] to-[#ec4899]',
    'purple-pink': 'from-[#8b5cf6] via-[#d946ef] to-[#ec4899]',
    'blue-purple': 'from-[#6366f1] via-[#8b5cf6] to-[#c084fc]'
  };

  return (
    <span 
      className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses[gradient]} animate-gradient-x ${className}`}
    >
      {children}
    </span>
  );
}