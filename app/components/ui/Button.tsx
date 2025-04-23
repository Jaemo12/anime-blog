'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'left'
}: ButtonProps) {
  // Variant styles
  const variants = {
    primary: 'bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white',
    secondary: 'bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-[#8b5cf6]',
    outline: 'bg-transparent backdrop-blur-sm border-2 border-[#8b5cf6] text-[#6d28d9] hover:bg-[#8b5cf6]/10',
    ghost: 'bg-transparent text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-md relative overflow-hidden transition-all
        flex items-center justify-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex items-center">{icon}</span>
      )}
      
      <span className="relative z-10">{children}</span>
      
      {icon && iconPosition === 'right' && (
        <span className="flex items-center">{icon}</span>
      )}
    </motion.button>
  );
}