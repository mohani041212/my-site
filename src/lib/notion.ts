import { Client } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN 환경 변수가 설정되지 않았습니다.");
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  // Notion SDK는 내부적으로 fetch를 사용하므로,
  // 커스텀 fetch를 주입해야 Next.js 데이터 캐시(revalidate)가 적용됩니다.
  fetch: (url, init) =>
    fetch(url, {
      ...init,
      next: { revalidate: 60 },
    }),
});