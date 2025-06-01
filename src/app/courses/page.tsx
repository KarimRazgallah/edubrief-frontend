import { fetchCourses } from "../../../lib/fetchCourses";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center">
          All Courses
        </h1>
        <p className="text-center text-blue-700 mb-8">
          Browse all available courses. Filter and search coming soon!
        </p>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100 p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {course.title}
              </h3>
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
              <Link
                href={`/courses/${course.databaseId}`}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-center"
              >
                View Course
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
