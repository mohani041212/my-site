import { isFullBlock } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "@/lib/notion";

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

/** 페이지(또는 블록) 하위의 모든 블록을 페이지네이션 + 재귀로 가져옵니다. */
export async function getPageBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if (isFullBlock(block)) blocks.push(block);
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  // 토글, 중첩 리스트 등 하위 블록이 있는 경우 재귀 조회
  await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        block.children = await getPageBlocks(block.id);
      }
    }),
  );

  return blocks;
}