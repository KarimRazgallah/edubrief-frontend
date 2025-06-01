'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string | null;
};

type FormState = {
  submitted: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    turnstileToken: null,
  });

  const [formState, setFormState] = useState<FormState>({
    submitted: false,
    loading: false,
    error: null,
    success: false,
  });

  // Function to handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ ...formState, loading: true, submitted: true, error: null });

    // Validate form fields
    if (!formData.name || !formData.email || !formData.message) {
      setFormState({
        ...formState,
        loading: false,
        error: 'Please fill in all required fields',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormState({
        ...formState,
        loading: false,
        error: 'Please enter a valid email address',
      });
      return;
    }

    // Validate Turnstile token
    if (!formData.turnstileToken) {
      setFormState({
        ...formState,
        loading: false,
        error: 'Please complete the Cloudflare Turnstile challenge',
      });
      return;
    }

    try {
      // Send the form data to the API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        turnstileToken: null,
      });

      setFormState({
        submitted: true,
        loading: false,
        error: null,
        success: true,
      });

      // Reset Turnstile (if available)
      // @ts-ignore - Turnstile global is added by the script
      if (window.turnstile) {
        // @ts-ignore
        window.turnstile.reset();
      }
    } catch (error) {
      setFormState({
        ...formState,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    }
  };

  // Handle Turnstile token callback
  useEffect(() => {
    // @ts-ignore - Turnstile global is added by the script
    window.onloadTurnstileCallback = function () {
      // @ts-ignore
      window.turnstile?.render('#turnstile-container', {
        sitekey: '1x00000000000000000000BB', // Replace with your actual Turnstile site key
        callback: function(token: string) {
          setFormData(prev => ({ ...prev, turnstileToken: token }));
        },
        'expired-callback': function() {
          setFormData(prev => ({ ...prev, turnstileToken: null }));
        }
      });
    };

    // Clean up
    return () => {
      // @ts-ignore
      delete window.onloadTurnstileCallback;
    };
  }, []);

  // FAQ data
  const faqs = [
    {
      question: 'How long does it take to complete a course?',
      answer: 'Course durations vary based on the topic and depth. Most courses can be completed within a few hours, but you can learn at your own pace.',
    },
    {
      question: 'How can I become an instructor?',
      answer: 'We\'re always looking for experts to join our teaching team. Please use this contact form and select "Become an Instructor" as the subject.',
    },
    {
      question: 'Do you offer certificates?',
      answer: 'Yes, upon completion of a course, you\'ll receive a digital certificate that you can share on your social media profiles or with potential employers.',
    },
    {
      question: 'Are the courses free?',
      answer: 'We offer both free and premium courses. Each course listing clearly indicates whether it requires payment.',
    },
    {
      question: 'Can I access courses on mobile devices?',
      answer: 'Yes, our platform is fully responsive and works on desktop, tablets, and mobile phones.',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-blue-700 mb-8 text-center max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 md:p-8">
            {formState.success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">Thank you for reaching out. We'll respond to your inquiry as soon as possible.</p>
                <button
                  onClick={() => setFormState({ submitted: false, loading: false, error: null, success: false })}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-blue-800 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Course Question">Course Question</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Become an Instructor">Become an Instructor</option>
                    <option value="Business Partnership">Business Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-800 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
                {/* Cloudflare Turnstile container */}
                <div id="turnstile-container" className="my-4"></div>
                
                {formState.error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p>{formState.error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={formState.loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  {formState.loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-blue-100 p-5"
                >
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Cloudflare Turnstile Script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        strategy="afterInteractive"
      />
    </main>
  );
}
