'use client';

import { ChangeEvent, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  placeholder = 'Search...',
  value: externalValue,
  onChange,
  onSearch,
  className = '',
  autoFocus = false
}: SearchInputProps) {
  // For controlled or uncontrolled input handling
  const [internalValue, setInternalValue] = useState('');
  const value = externalValue !== undefined ? externalValue : internalValue;
  
  // Handler for input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // For uncontrolled usage
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }
    // For controlled usage
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Handler for search submission
  const handleSearch = () => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };
  
  // Handler for Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Clear input handler
  const handleClear = () => {
    if (externalValue === undefined) {
      setInternalValue('');
    }
    if (onChange) {
      onChange('');
    }
    // Focus back on input after clearing
    const inputElement = document.getElementById('search-input');
    if (inputElement) {
      inputElement.focus();
    }
  };
  
  return (
    <div className={`relative flex-grow ${className}`}>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 
                  text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 pl-10 pr-10"
      />
      
      <motion.button
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b5cf6]"
        onClick={handleSearch}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Search"
      >
        <FaSearch />
      </motion.button>
      
      {value && (
        <motion.button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8b5cf6]"
          onClick={handleClear}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Clear search"
        >
          <FaTimes />
        </motion.button>
      )}
    </div>
  );
}