import { NextResponse } from "next/server";
// import typesenseClient from '@/lib/typesenseClient';
import typesenseClient from "../../../../lib/typesenseClient";

// Define collections to search in
const COLLECTIONS = [
  { name: "courses", label: "Courses" },
  { name: "posts", label: "Blog Posts" },
  { name: "instructors", label: "Instructors" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const collection = searchParams.get("collection");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  try {
    const searchResults = [];

    // If a specific collection is specified, only search in that collection
    const collectionsToSearch = collection
      ? COLLECTIONS.filter((c) => c.name === collection)
      : COLLECTIONS;

    // Search in all specified collections
    for (const col of collectionsToSearch) {
      const searchParams = {
        q: query,
        query_by: getQueryByFields(col.name),
        highlight_full_fields: getQueryByFields(col.name),
        per_page: 10,
      };

      const results = await typesenseClient
        .collections(col.name)
        .documents()
        .search(searchParams);

      // Normalize and categorize results
      const normalizedResults =
        results.hits?.map((hit) => ({
          ...hit.document,
          _collection: col.name,
          _highlights: hit.highlights,
          _score: hit.text_match,
        })) || [];

      searchResults.push({
        collection: col,
        hits: normalizedResults,
        totalHits: results.found,
      });
    }

    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error("Typesense search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}

// Helper to get the appropriate fields to search in based on collection
function getQueryByFields(collectionName: string): string {
  switch (collectionName) {
    case "courses":
      return "title,content,difficulty,tags";
    case "posts":
      return "title,content,excerpt,categories,tags";
    case "instructors":
      return "title,bio,name";
    default:
      return "title,content";
  }
}
