import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NewsletterFormContainer from "../components/NewsletterFormContainer";
import GoogleAnalytics from "../components/GoogleAnalytics";
import GoogleTagManager from "../components/GoogleTagManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduBrief | Learn with Expert-Led Courses and Insightful Blog Posts",
  description:
    "EduBrief is a unified online learning platform with short courses and expert-written blog posts. Enhance your skills with our diverse educational content.",
  keywords: [
    "online courses",
    "learning platform",
    "educational blog",
    "expert instructors",
    "skills development",
  ],
  authors: [{ name: "EduBrief Team" }],
  creator: "EduBrief",
  publisher: "EduBrief",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "EduBrief | Learn with Expert-Led Courses",
    description:
      "Discover short courses and expert-written blog posts on EduBrief.",
    url: "https://edubrief.vercel.app", // Replace with your actual domain
    siteName: "EduBrief",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduBrief | Expert-Led Courses and Blog Posts",
    description:
      "Discover short courses and expert-written blog posts on EduBrief.",
    creator: "@edubrief", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <GoogleTagManager GTM_ID={process.env.NEXT_PUBLIC_GTM_ID || ''} />
        {/* Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <a
                href="/"
                className="text-2xl font-extrabold text-blue-700 tracking-tight"
              >
                EduBrief
              </a>
            </div>
            <ul className="flex gap-6 text-blue-800 font-medium">
              <li>
                <a
                  href="/courses"
                  className="hover:text-blue-600 transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-blue-600 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/instructors"
                  className="hover:text-blue-600 transition-colors"
                >
                  Instructors
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>
        {/* Main Content */}
        {children}
        {/* Footer */}
        <footer className="mt-16 border-t border-blue-100 bg-white/80 backdrop-blur py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10 mb-8">
              <div>
                <span className="text-blue-700 font-bold text-xl mb-3 block">
                  EduBrief
                </span>
                <p className="text-blue-600 text-sm mb-4">
                  A unified platform for discovering expert-led courses and
                  insightful blog posts.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="GitHub"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-3">
                  Quick Links
                </h3>
                <nav className="flex flex-col gap-2 text-blue-700 text-sm">
                  <a
                    href="/courses"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Courses
                  </a>
                  <a
                    href="/blog"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Blog
                  </a>
                  <a
                    href="/instructors"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Instructors
                  </a>
                  <a
                    href="/contact"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Contact
                  </a>
                </nav>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-3">Subscribe</h3>
                <p className="text-blue-700 text-sm mb-2">
                  Get the latest updates from EduBrief
                </p>
                <div className="w-full">
                  <NewsletterFormContainer variant="compact" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <nav className="flex gap-6 text-blue-700 text-sm">
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Sitemap
                </a>
              </nav>
              <span className="text-blue-400 text-xs">
                &copy; {new Date().getFullYear()} EduBrief. All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
