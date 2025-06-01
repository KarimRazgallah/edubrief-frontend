import { fetchCourses } from "../../lib/fetchCourses";
import { gql } from "@apollo/client";
import client from "../../lib/apolloClient";

// Function to fetch all blog posts slugs
async function fetchBlogSlugs() {
  const { data } = await client.query({
    query: gql`
      query {
        posts(first: 100) {
          nodes {
            slug
            modified
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return data.posts.nodes;
}

// Function to fetch all instructor slugs
async function fetchInstructorSlugs() {
  const { data } = await client.query({
    query: gql`
      query {
        instructors(first: 100) {
          nodes {
            slug
            modified
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return data.instructors.nodes;
}

export default async function sitemap() {
  const baseUrl = "https://edubrief.vercel.app";  // Replace with your actual domain
  
  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instructors`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];

  // Get dynamic course routes
  const courses = await fetchCourses();
  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.databaseId}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  // Get dynamic blog post routes
  const blogPosts = await fetchBlogSlugs();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.modified ? new Date(post.modified) : new Date(),
    priority: 0.7,
  }));

  // Get dynamic instructor routes
  const instructors = await fetchInstructorSlugs();
  const instructorRoutes = instructors.map((instructor) => ({
    url: `${baseUrl}/instructors/${instructor.slug}`,
    lastModified: instructor.modified ? new Date(instructor.modified) : new Date(),
    priority: 0.7,
  }));

  // Combine all routes
  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...instructorRoutes];
}
