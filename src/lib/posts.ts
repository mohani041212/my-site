import { cache } from "react";
import { isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "@/lib/notion";
import type { Post } from "@/types/post";

const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

type Property = PageObjectResponse["properties"][string];

const plain = (items: { plain_text: string }[]) =>
  items.map((t) => t.plain_text).join("");

/** rich_text → string (비어 있으면 undefined) */
const getText = (p?: Property): string | undefined =>
  p?.type === "rich_text" ? plain(p.rich_text) || undefined : undefined;

const getUrl = (p?: Property): string | undefined =>
  p?.type === "url" ? p.url ?? undefined : undefined;

function mapPageToPost(page: PageObjectResponse): Post {
  const props = page.properties;
  const { Title, Slug, Category, Published, Tags } = props;

  return {
    id: page.id,
    title: Title?.type === "title" ? plain(Title.title) : "",
    slug: getText(Slug) ?? "",
    category: Category?.type === "select" ? Category.select?.name ?? null : null,
    published: Published?.type === "checkbox" ? Published.checkbox : false,
    createdAt: page.created_time,

    tags:
      Tags?.type === "multi_select"
        ? Tags.multi_select.map((t) => t.name)
        : undefined,
    problem: getText(props.Problem),
    solution: getText(props.Solution),
    date: props.Date?.type === "date" ? props.Date.date?.start : undefined,
    github: getUrl(props.Github),
    externalLink: getUrl(props.ExternalLink),
  };
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!dataSourceId) {
    throw new Error("NOTION_DATA_SOURCE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const posts: Post[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    });

    for (const result of response.results) {
      if (isFullPage(result)) posts.push(mapPageToPost(result));
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return posts;
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  if (!dataSourceId) {
    throw new Error("NOTION_DATA_SOURCE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
    page_size: 1,
  });

  const page = response.results.find((r) => isFullPage(r));
  return page && isFullPage(page) ? mapPageToPost(page) : null;
});
