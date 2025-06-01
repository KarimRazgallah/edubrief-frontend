import { gql } from "@apollo/client";
import client from "../../../../lib/apolloClient";
import Link from "next/link";
import { notFound } from "next/navigation";

interface InstructorDetailProps {
  params: { slug: string };
}

async function fetchInstructorBySlug(slug: string) {
  const { data } = await client.query({
    query: gql`
      query ($slug: ID!) {
        instructor(id: $slug, idType: SLUG) {
          id
          title
          instructors {
            bio
            photo {
              node {
                mediaItemUrl
              }
            }
            socialLinks {
              linkedin
              twitter
              website
            }
            courses {
              nodes {
                ... on Course {
                  id
                  title
                  databaseId
                  courses {
                    difficulty
                    duration
                    tags
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { slug },
    fetchPolicy: "no-cache",
  });
  return data.instructor;
}

export default async function InstructorDetailPage({
  params,
}: InstructorDetailProps) {
  const instructor = await fetchInstructorBySlug(params.slug);
  if (!instructor) return notFound();
  const { bio, photo, socialLinks, courses } = instructor.instructors || {};
  const coursesTaught = courses?.nodes || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-blue-100 p-8">
        <div className="flex flex-col items-center mb-6">
          {photo?.node?.mediaItemUrl && (
            <img
              src={photo.node.mediaItemUrl}
              alt={instructor.title}
              className="w-24 h-24 rounded-full border mb-3"
            />
          )}
          <h1 className="text-2xl font-extrabold text-blue-900 mb-2 text-center">
            {instructor.title}
          </h1>
          {socialLinks && (
            <div className="flex gap-4 mb-2">
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Twitter
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
        {bio && (
          <article
            className="prose prose-blue max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        )}
        {/* List of courses taught by this instructor */}
        {coursesTaught.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Courses Taught
            </h2>
            <ul className="space-y-4">
              {coursesTaught.map((course: any) => (
                <li
                  key={course.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                >
                  <Link
                    href={`/courses/${course.databaseId}`}
                    className="text-lg font-semibold text-blue-900 hover:underline"
                  >
                    {course.title}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.courses.tags && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {course.courses.tags}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {course.courses.difficulty?.join(", ")}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                      {course.courses.duration}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link
          href="/instructors"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 font-medium transition-colors"
        >
          ← Back to Instructors
        </Link>
      </section>
    </main>
  );
}
