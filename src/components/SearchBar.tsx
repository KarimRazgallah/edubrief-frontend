'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'compact';
}

export default function SearchBar({
  className = '',
  placeholder = 'Search courses, blog posts, instructors...',
  variant = 'default'
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-1 text-sm rounded-md border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          aria-label="Search"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-l-md border border-r-0 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Search"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition-colors"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </form>
  );
}
