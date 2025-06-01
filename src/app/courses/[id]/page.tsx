import { gql } from "@apollo/client";
import client from "../../../../lib/apolloClient";
import Link from "next/link";
import { notFound } from "next/navigation";

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
