'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  _collection: string;
  _highlights?: any[];
  [key: string]: any;
}

interface CategoryResults {
  collection: {
    name: string;
    label: string;
  };
  hits: SearchResult[];
  totalHits: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<CategoryResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search when query parameter changes
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/typesense-search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('An error occurred while searching. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getCollectionLink = (result: SearchResult) => {
    switch (result._collection) {
      case 'courses':
        return `/courses/${result.databaseId || result.id}`;
      case 'posts':
        return `/blog/${result.slug || result.id}`;
      case 'instructors':
        return `/instructors/${result.slug || result.id}`;
      default:
        return '#';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center">
          Search EduBrief
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses, blog posts, instructors..."
              className="w-full px-4 py-2 rounded-l-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Search"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block border-4 border-blue-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-2 text-blue-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 rounded">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && query && results.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-2">No results found for "{query}"</p>
            <p className="text-sm text-gray-500">Try different keywords or check your spelling</p>
          </div>
        )}

        {results.map((categoryResults) => (
          <div key={categoryResults.collection.name} className="mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-100 pb-2">
              {categoryResults.collection.label} ({categoryResults.totalHits})
            </h2>
            
            {categoryResults.hits.length === 0 ? (
              <p className="text-gray-600">No {categoryResults.collection.label.toLowerCase()} found matching your search</p>
            ) : (
              <div className="space-y-6">
                {categoryResults.hits.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
                    <Link href={getCollectionLink(result)} className="block group">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2 group-hover:text-blue-600">
                        {result.title}
                      </h3>
                      
                      {result._collection === 'courses' && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {result.difficulty && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              {Array.isArray(result.difficulty) 
                                ? result.difficulty.join(', ')
                                : result.difficulty}
                            </span>
                          )}
                          {result.duration && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                              {result.duration}
                            </span>
                          )}
                          {result.tags && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {result.tags}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Snippet/excerpt text */}
                      {(result.content || result.excerpt || result.bio) && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-1">
                          {(result.content || result.excerpt || result.bio)
                            .replace(/<[^>]*>/g, '')
                            .substring(0, 150)}...
                        </p>
                      )}
                      
                      <span className="text-blue-600 text-sm font-medium hover:underline">
                        View details →
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
