import Link from "next/link";
import type { Post } from "@/types/post";
import { formatDate } from "@/lib/format";
import { getPostDate } from "@/lib/post-utils";

function MemoRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 font-medium text-gray-500">{label}</dt>
      <dd className="line-clamp-2 text-gray-800">{text}</dd>
    </div>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const when = getPostDate(post);
  const hasMemo = post.problem || post.solution;

  return (
    <article className="relative flex h-full flex-col rounded-xl border border-gray-200 p-5 transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2 text-xs">
        {post.category ? (
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">
            {post.category}
          </span>
        ) : (
          <span />
        )}
        <time dateTime={when} className="text-gray-400">
          {formatDate(when)}
        </time>
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug">
        <Link
          href={`/projects/${post.slug}`}
          className="after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h2>

      {post.tags && post.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/projects?tag=${encodeURIComponent(tag)}`}
                className="relative z-10 block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 transition hover:bg-gray-200"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasMemo && (
        <dl className="mt-4 space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm">
          {post.problem && <MemoRow label="Problem" text={post.problem} />}
          {post.solution && <MemoRow label="Solution" text={post.solution} />}
        </dl>
      )}

      {(post.github || post.externalLink) && (
        <div className="mt-auto flex gap-3 pt-4 text-xs">
          {post.github && (
            <a
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-gray-500 hover:text-gray-900"
            >
              GitHub ↗
            </a>
          )}
          {post.externalLink && (
            <a
              href={post.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-gray-500 hover:text-gray-900"
            >
              Link ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}