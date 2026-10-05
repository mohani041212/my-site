import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { countTags } from "@/lib/post-utils";
import { competencies } from "@/data/competencies";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About" };
export const revalidate = 60;

export default async function AboutPage() {
  const counts = countTags(await getPublishedPosts());

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <p className="mt-4 text-gray-600">{profile.intro}</p>

      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Competencies</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {competencies.map((c) => (
            <li key={c.id} className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {c.tags.map((tag) => {
                  const count = counts.get(tag) ?? 0;
                  return (
                    <li key={tag}>
                      {count > 0 ? (
                        <Link
                          href={`/projects?tag=${encodeURIComponent(tag)}`}
                          className="block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-900 hover:text-white"
                        >
                          {tag} <span className="opacity-60">{count}</span>
                        </Link>
                      ) : (
                        <span className="block cursor-default rounded-full border border-dashed border-gray-200 px-3 py-1 text-xs text-gray-400">
                          {tag}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Timeline</h2>
        <ol className="space-y-8 border-l-2 border-gray-200 pl-6">
          {profile.timeline.map((item) => (
            <li key={item.period + item.title} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-gray-900" />
              <p className="text-sm text-gray-500">{item.period}</p>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}