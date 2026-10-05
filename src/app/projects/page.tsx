import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { countTags, sortByDate } from "@/lib/post-utils";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = { title: "Projects" };

type Props = { searchParams: Promise<{ tag?: string | string[] }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const { tag: rawTag } = await searchParams;
  const activeTag = Array.isArray(rawTag) ? rawTag[0] : rawTag;

  const posts = sortByDate(await getPublishedPosts());

  const allTags = [...countTags(posts).entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition ${
      active
        ? "border-gray-900 bg-gray-900 text-white"
        : "border-gray-200 text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Projects</h1>

      <nav aria-label="Filter by tag" className="mt-8 flex flex-wrap gap-2">
        <Link href="/projects" className={chip(!activeTag)}>
          All ({posts.length})
        </Link>
        {allTags.map(([tag, count]) => {
          const active = tag === activeTag;
          return (
            <Link
              key={tag}
              // 선택된 태그를 다시 누르면 필터 해제
              href={
                active ? "/projects" : `/projects?tag=${encodeURIComponent(tag)}`
              }
              aria-pressed={active}
              className={chip(active)}
            >
              {tag} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </nav>

      {activeTag && (
        <p className="mt-6 text-sm text-gray-500">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for{" "}
          <strong className="text-gray-900">#{activeTag}</strong>
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No posts found.{" "}
          <Link href="/projects" className="underline">
            Clear filter
          </Link>
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}