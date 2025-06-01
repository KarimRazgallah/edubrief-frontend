import { gql } from "@apollo/client";
import client from "../../../../lib/apolloClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogPostProps {
  params: { slug: string };
}

async function fetchPostBySlug(slug: string) {
  const { data } = await client.query({
    query: gql`
      query ($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          databaseId
          title
          content
          date
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    variables: { slug },
    fetchPolicy: "no-cache",
  });
  return data.post;
}

async function fetchRelatedPosts(
  categoryIds: string[],
  postId: string,
  limit = 3
) {
  // Only fetch if we have categories to match against
  if (!categoryIds.length) return [];

  const { data } = await client.query({
    query: gql`
      query ($categoryIds: [ID], $postId: ID!, $limit: Int!) {
        posts(
          first: $limit
          where: { categoryIn: $categoryIds, notIn: [$postId] }
        ) {
          nodes {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    `,
    variables: {
      categoryIds,
      postId,
      limit,
    },
    fetchPolicy: "no-cache",
  });

  return data.posts.nodes;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) return notFound();

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get category IDs for fetching related posts
  const categoryIds = post.categories.nodes.map((cat: any) => cat.id);
  const relatedPosts = await fetchRelatedPosts(categoryIds, post.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
        {post.featuredImage?.node && (
          <div className="h-64 sm:h-80 overflow-hidden">
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.nodes.map((category: any) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-blue-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-blue-100">
            {post.author?.node?.avatar?.url && (
              <img
                src={post.author.node.avatar.url}
                alt={post.author.node.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-blue-800">
                {post.author?.node?.name || "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>

          <div
            className="prose prose-blue max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.nodes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-blue-100">
              {post.tags.nodes.map((tag: any) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Related Posts
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {relatedPosts.map((related: any) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {related.featuredImage?.node && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={related.featuredImage.node.sourceUrl}
                      alt={related.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-blue-800 line-clamp-2">
                    {related.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto mt-8">
        <Link
          href="/blog"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 font-medium transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
