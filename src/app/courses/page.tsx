"use client";
import { useEffect, useState } from "react";
import { fetchCourses } from "../../../lib/fetchCourses";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allDifficulties, setAllDifficulties] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setFilteredCourses(data);
      // Collect all unique tags and difficulties
      const tagsSet = new Set<string>();
      const diffSet = new Set<string>();
      data.forEach((course: any) => {
        if (course.courses.tags) tagsSet.add(course.courses.tags);
        if (course.courses.difficulty) {
          course.courses.difficulty.forEach((d: string) => diffSet.add(d));
        }
      });
      setAllTags(Array.from(tagsSet));
      setAllDifficulties(Array.from(diffSet));
    });
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (search) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (difficulty) {
      filtered = filtered.filter(
        (c) => c.courses.difficulty && c.courses.difficulty.includes(difficulty)
      );
    }
    if (tag) {
      filtered = filtered.filter((c) => c.courses.tags === tag);
    }
    setFilteredCourses(filtered);
  }, [search, difficulty, tag, courses]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center">
          All Courses
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-200 rounded-md px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-blue-200 rounded-md px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Difficulties</option>
            {allDifficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border border-blue-200 rounded-md px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center text-blue-700">
              No courses found.
            </div>
          ) : (
            filteredCourses.map((course: any) => (
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
            ))
          )}
        </div>
      </section>
    </main>
  );
}
