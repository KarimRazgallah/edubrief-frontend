'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export default function NewsletterForm({ variant = 'default', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to subscribe. Please try again later.'
      );
    }
  };
  
  if (variant === 'compact') {
    return (
      <div className={className}>
        {status === 'success' ? (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
            Thanks for subscribing! Check your inbox to confirm your subscription.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-3 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-1 text-red-600 text-xs">{errorMessage}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`bg-blue-50 border border-blue-100 rounded-xl p-6 ${className}`}>
      <h3 className="text-xl font-bold text-blue-900 mb-2">
        Stay Updated
      </h3>
      <p className="text-blue-700 mb-4">
        Subscribe to our newsletter for the latest courses, articles, and educational resources.
      </p>
      
      {status === 'success' ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-md">
          <p className="font-medium">Thanks for subscribing!</p>
          <p className="text-sm mt-1">Please check your inbox to confirm your subscription.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-grow px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}
      
      {status === 'error' && (
        <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
      )}
      
      <p className="text-xs text-blue-600 mt-3">
        We respect your privacy. You can unsubscribe at any time.
      </p>
    </div>
  );
}
