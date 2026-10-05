import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold tracking-tight">Latest</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/projects/${post.slug}`}
                className="flex h-full flex-col rounded-xl border border-gray-200 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {post.category && (
                  <span className="mb-3 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {post.category}
                  </span>
                )}
                <h2 className="text-xl font-semibold leading-snug">
                  {post.title}
                </h2>
                <time
                  dateTime={post.createdAt}
                  className="mt-auto pt-6 text-sm text-gray-500"
                >
                  {formatDate(post.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}