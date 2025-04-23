'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  maxPageButtons = 5
}: BlogPaginationProps) {
  // Calculate visible page numbers
  const visiblePageNumbers = useMemo(() => {
    if (!showPageNumbers || totalPages <= 1) return [];
    
    // If total pages is less than or equal to max buttons, show all pages
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    // Adjust if end page is greater than total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    // Generate array of page numbers
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages, showPageNumbers, maxPageButtons]);
  
  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={`flex justify-center mt-10 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <motion.button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </motion.button>
        
        {/* First Page */}
        {showPageNumbers && visiblePageNumbers[0] > 1 && (
          <>
            <motion.button
              onClick={() => onPageChange(1)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-[#8b5cf6] hover:bg-[#8b5cf6]/10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              1
            </motion.button>
            
            {visiblePageNumbers[0] > 2 && (
              <span className="text-gray-400 px-1">
                <FaEllipsisH />
              </span>
            )}
          </>
        )}
        
        {/* Page Numbers */}
        {showPageNumbers && visiblePageNumbers.map(number => (
          <motion.button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 rounded-md flex items-center justify-center ${
              currentPage === number
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white'
                : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
            }`}
            whileHover={currentPage !== number ? { scale: 1.1 } : {}}
            whileTap={currentPage !== number ? { scale: 0.9 } : {}}
          >
            {number}
          </motion.button>
        ))}
        
        {/* Last Page */}
        {showPageNumbers && visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
          <>
            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
              <span className="text-gray-400 px-1">
                <FaEllipsisH />
              </span>
            )}
            
            <motion.button
              onClick={() => onPageChange(totalPages)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-[#8b5cf6] hover:bg-[#8b5cf6]/10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {totalPages}
            </motion.button>
          </>
        )}
        
        {/* Next Button */}
        <motion.button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-[#8b5cf6] hover:bg-[#8b5cf6]/10'
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
          aria-label="Next page"
        >
          <FaChevronRight />
        </motion.button>
      </div>
    </div>
  );
}