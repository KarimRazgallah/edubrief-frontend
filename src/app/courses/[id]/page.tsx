import { gql } from "@apollo/client";
import client from "../../../../lib/apolloClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CourseDetailProps {
  params: { id: string };
}

async function fetchCourseById(id: string) {
  const { data } = await client.query({
    query: gql`
      query ($id: ID!) {
        course(id: $id, idType: DATABASE_ID) {
          id
          title
          content
          courses {
            difficulty
            duration
            tags
            instructor {
              node {
                ... on Instructor {
                  id
                  slug
                  title
                  instructors {
                    bio
                    socialLinks {
                      fieldGroupName
                      linkedin
                      twitter
                      website
                    }
                    photo {
                      node {
                        mediaItemUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { id },
    fetchPolicy: "no-cache",
  });
  return data.course;
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const course = await fetchCourseById(params.id);
  if (!course) return notFound();
  // Get instructor info from the new query structure
  const instructor = course.courses?.instructor?.node?.instructors;
  const instructorSlug = course.courses?.instructor?.node?.slug;
  const instructorName = course.courses?.instructor?.node?.title;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-blue-100 p-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-4">
          {course.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {course.courses.tags && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {course.courses.tags}
            </span>
          )}
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {course.courses.difficulty.join(", ")}
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
            {course.courses.duration}
          </span>
        </div>
        {instructor && (
          <div className="flex items-center gap-3 mb-6">
            {instructor.photo?.node?.mediaItemUrl && (
              <img
                src={instructor.photo.node.mediaItemUrl}
                alt={instructorSlug}
                className="w-10 h-10 rounded-full border"
              />
            )}
            <Link
              href={`/instructors/${instructorSlug}`}
              className="text-blue-700 font-medium hover:underline"
            >
              {/* Show instructor name if available, fallback to slug */}
              {instructorName}
            </Link>
            {instructor.bio && (
              <span className="text-xs text-gray-500 ml-2 line-clamp-1 max-w-xs">
                {instructor.bio.replace(/<[^>]+>/g, "").slice(0, 60)}...
              </span>
            )}
          </div>
        )}
        <article
          className="prose prose-blue max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: course.content }}
        />
        <Link
          href="/courses"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 font-medium transition-colors"
        >
          ← Back to Courses
        </Link>
      </section>
    </main>
  );
}
