import { gql } from "@apollo/client";
import client from "../../../lib/apolloClient";
import Link from "next/link";

async function fetchInstructors() {
  const { data } = await client.query({
    query: gql`
      query {
        instructors(first: 100) {
          nodes {
            id
            slug
            title
            instructors {
              bio
              photo {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return data.instructors.nodes;
}

export default async function InstructorsPage() {
  const instructors = await fetchInstructors();
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8 text-center">
          Meet Our Instructors
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor: any) => (
            <Link
              key={instructor.id}
              href={`/instructors/${instructor.slug}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100 p-6 flex flex-col items-center group"
            >
              {instructor.instructors?.photo?.node?.mediaItemUrl && (
                <img
                  src={instructor.instructors.photo.node.mediaItemUrl}
                  alt={instructor.title}
                  className="w-20 h-20 rounded-full border mb-4 group-hover:scale-105 transition-transform"
                />
              )}
              <h2 className="text-xl font-semibold text-blue-900 mb-2 text-center">
                {instructor.title}
              </h2>
              {instructor.instructors?.bio && (
                <div className="text-blue-700 text-sm text-center line-clamp-3 mb-2">
                  {instructor.instructors.bio
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 100)}
                  ...
                </div>
              )}
              <span className="mt-auto text-blue-600 font-medium hover:underline">
                View Profile →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
