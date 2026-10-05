import type { Post } from "@/types/post";

/** 활동 날짜(Date)가 있으면 그것을, 없으면 노션 생성일을 사용 */
export const getPostDate = (post: Post): string => post.date ?? post.createdAt;

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => Date.parse(getPostDate(b)) - Date.parse(getPostDate(a)),
  );
}

/** 태그별 글 개수 */
export function countTags(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}