'use client';

import { FaTags } from 'react-icons/fa';
import GradientText from '../ui/GradientText';

interface Category {
  id: string;
  name: string;
  count: number;
  slug?: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  title?: string;
  className?: string;
}

export default function CategoryList({
  categories,
  selectedCategory = null,
  onSelectCategory,
  title = 'Categories',
  className = ''
}: CategoryListProps) {
  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      // If already selected, deselect it
      onSelectCategory(selectedCategory === categoryName ? null : categoryName);
    }
  };
  
  return (
    <div className={`p-6 rounded-xl bg-white/60 backdrop-blur-sm shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-4">
        <GradientText>{title}</GradientText>
      </h3>
      
      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories available</p>
      ) : (
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id}>
              <button 
                className={`text-sm flex items-center justify-between w-full p-2 rounded-md transition-colors ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-[#8b5cf6]/20 to-[#d946ef]/20 text-[#8b5cf6]' 
                    : 'text-gray-600 hover:bg-[#8b5cf6]/10'
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="flex items-center">
                  <FaTags className="mr-2 text-xs text-[#8b5cf6]" />
                  {category.name}
                </span>
                <span className="text-xs bg-[#8b5cf6]/10 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}