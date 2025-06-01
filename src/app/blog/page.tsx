'use client';

import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Link from 'next/link';

interface Post {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await client.query({
          query: gql`
            query {
              posts(first: 20) {
                nodes {
                  id
                  databaseId
                  title
                  slug
                  excerpt
                  date
                  categories {
                    nodes {
                      id
                      name
                    }
                  }
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
              categories {
                nodes {
                  id
                  name
                }
              }
            }
          `,
          fetchPolicy: 'no-cache'
        });
        
        setPosts(data.posts.nodes);
        setCategories(data.categories.nodes);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  // Filter posts by category
  const filteredPosts = categoryFilter 
    ? posts.filter(post => 
        post.categories.nodes.some(cat => cat.name === categoryFilter)
      )
    : posts;

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center">
          Our Blog
        </h1>
        <p className="text-lg text-blue-700 mb-8 text-center max-w-2xl mx-auto">
          Discover insightful articles and tutorials from our expert instructors
        </p>

        {/* Category filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-md shadow-sm border border-blue-100">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 text-sm font-medium ${
                categoryFilter === '' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-blue-600 hover:bg-blue-50'
              } rounded-l-md`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.name)}
                className={`px-4 py-2 text-sm font-medium ${
                  categoryFilter === category.name 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block border-4 border-blue-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-2 text-blue-600">Loading blog posts...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No blog posts found in this category.</p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`}
                    key={post.id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100 overflow-hidden flex flex-col"
                  >
                    {post.featuredImage?.node && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.featuredImage.node.sourceUrl} 
                          alt={post.featuredImage.node.altText || post.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex gap-2 mb-2">
                        {post.categories.nodes.map(category => (
                          <span 
                            key={category.id} 
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold text-blue-900 mb-2">
                        {post.title}
                      </h2>
                      <div 
                        className="text-gray-600 text-sm mb-4 flex-grow"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.substring(0, 150) + '...' }}
                      />
                      <div className="flex justify-between items-center mt-auto text-sm text-gray-500">
                        <span>{formatDate(post.date)}</span>
                        <span className="text-blue-600 hover:underline">Read more →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
