import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPosts, getPostBySlug } from "@/lib/posts";
import { getPageBlocks } from "@/lib/blocks";
import { formatDate } from "@/lib/format";
import { getPostDate } from "@/lib/post-utils";
import NotionRenderer from "@/components/notion/NotionRenderer";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(decodeSlug((await params).slug));
  return { title: post?.title ?? "Post not found" };
}

export default async function ProjectPage({ params }: Props) {
  const post = await getPostBySlug(decodeSlug((await params).slug));
  if (!post) notFound();

  const blocks = await getPageBlocks(post.id);
  const when = getPostDate(post);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/projects" className="text-sm text-gray-500 hover:text-gray-900">
        ← Projects
      </Link>

      <header className="mb-10 mt-6 border-b pb-8">
        {post.category && (
          <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {post.category}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <time dateTime={when}>{formatDate(when)}</time>
          {post.github && (
            <a
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              GitHub ↗
            </a>
          )}
          {post.externalLink && (
            <a
              href={post.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              Link ↗
            </a>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/projects?tag=${encodeURIComponent(tag)}`}
                  className="block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 transition hover:bg-gray-200"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {(post.problem || post.solution) && (
          <dl className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
            {post.problem && (
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-medium text-gray-500">Problem</dt>
                <dd className="text-gray-800">{post.problem}</dd>
              </div>
            )}
            {post.solution && (
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-medium text-gray-500">Solution</dt>
                <dd className="text-gray-800">{post.solution}</dd>
              </div>
            )}
          </dl>
        )}
      </header>

      <article>
        <NotionRenderer blocks={blocks} />
      </article>
    </div>
  );
}