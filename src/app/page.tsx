import { fetchCourses } from "../../lib/fetchCourses";
import Link from "next/link";

export default async function Home() {
  const courses = await fetchCourses();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Welcome to EduBrief
        </h1>
        <p className="text-lg md:text-xl text-blue-700 mb-6">
          Discover short, expert-led courses and insightful blog posts.
        </p>
        {/* Search Bar Placeholder */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search courses, posts, instructors..."
            className="w-full max-w-md px-4 py-2 rounded-l-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled
          />
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md cursor-not-allowed">
            Search
          </button>
        </div>
        <span className="text-xs text-blue-400 mt-2 block">
          (Search coming soon)
        </span>
      </section>

      {/* Courses Grid */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Featured Courses
        </h2>
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
                href={`/courses/${course.id}`}
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
