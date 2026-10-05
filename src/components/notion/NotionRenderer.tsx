import type { ReactNode } from "react";
import type { NotionBlock } from "@/lib/blocks";
import RichText from "@/components/notion/RichText";

function Children({ block }: { block: NotionBlock }) {
  if (!block.children?.length) return null;
  return <div className="ml-6 mt-2">{renderBlocks(block.children)}</div>;
}

function BlockView({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <div className="my-4">
          <p className="whitespace-pre-wrap leading-8 text-gray-800">
            <RichText items={block.paragraph.rich_text} />
          </p>
          <Children block={block} />
        </div>
      );

    case "heading_1":
      return (
        <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight">
          <RichText items={block.heading_1.rich_text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="mb-3 mt-8 border-b pb-2 text-2xl font-bold tracking-tight">
          <RichText items={block.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="mb-2 mt-6 text-xl font-semibold">
          <RichText items={block.heading_3.rich_text} />
        </h3>
      );

    case "to_do":
      return (
        <div className="my-1">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              className="mt-2 h-4 w-4"
            />
            <span
              className={`leading-8 ${
                block.to_do.checked ? "text-gray-400 line-through" : ""
              }`}
            >
              <RichText items={block.to_do.rich_text} />
            </span>
          </label>
          <Children block={block} />
        </div>
      );

    case "quote":
      return (
        <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic text-gray-600">
          <RichText items={block.quote.rich_text} />
          <Children block={block} />
        </blockquote>
      );

    case "callout": {
      const icon = block.callout.icon;
      return (
        <div className="my-6 flex gap-3 rounded-lg bg-gray-50 p-4">
          {icon?.type === "emoji" && (
            <span className="text-xl leading-8">{icon.emoji}</span>
          )}
          <div className="leading-8">
            <RichText items={block.callout.rich_text} />
            <Children block={block} />
          </div>
        </div>
      );
    }

    case "code": {
      const code = block.code.rich_text.map((t) => t.plain_text).join("");
      return (
        <figure className="my-6 overflow-hidden rounded-lg bg-gray-900">
          <div className="border-b border-gray-700 px-4 py-1.5 text-xs uppercase tracking-wide text-gray-400">
            {block.code.language}
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6 text-gray-100">
            <code>{code}</code>
          </pre>
          {block.code.caption.length > 0 && (
            <figcaption className="border-t border-gray-700 px-4 py-2 text-xs text-gray-400">
              <RichText items={block.code.caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "image": {
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption = block.image.caption;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption.map((t) => t.plain_text).join("")}
            loading="lazy"
            className="mx-auto h-auto max-w-full rounded-lg"
          />
          {caption.length > 0 && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              <RichText items={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "divider":
      return <hr className="my-10 border-gray-200" />;

    case "toggle":
      return (
        <details className="my-3 rounded-md border px-4 py-2">
          <summary className="cursor-pointer font-medium">
            <RichText items={block.toggle.rich_text} />
          </summary>
          <Children block={block} />
        </details>
      );

    case "bookmark":
      return (
        <a
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block truncate rounded-lg border p-3 text-sm text-blue-600 hover:bg-gray-50"
        >
          {block.bookmark.url}
        </a>
      );

    default:
      // 아직 지원하지 않는 블록(table, column_list 등)은 건너뜀
      return null;
  }
}

/** 연속된 리스트 아이템을 하나의 <ul>/<ol>로 묶어서 렌더링합니다. */
function renderBlocks(blocks: NotionBlock[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const listType = block.type;
      const items: NotionBlock[] = [];

      while (i < blocks.length && blocks[i].type === listType) {
        items.push(blocks[i]);
        i++;
      }

      const Tag = listType === "bulleted_list_item" ? "ul" : "ol";
      const listClass =
        listType === "bulleted_list_item" ? "list-disc" : "list-decimal";

      nodes.push(
        <Tag key={items[0].id} className={`my-4 ml-6 ${listClass} space-y-1`}>
          {items.map((item) => {
            if (
              item.type !== "bulleted_list_item" &&
              item.type !== "numbered_list_item"
            ) {
              return null;
            }
            const richText =
              item.type === "bulleted_list_item"
                ? item.bulleted_list_item.rich_text
                : item.numbered_list_item.rich_text;

            return (
              <li key={item.id} className="leading-8">
                <RichText items={richText} />
                {item.children && renderBlocks(item.children)}
              </li>
            );
          })}
        </Tag>,
      );
    } else {
      nodes.push(<BlockView key={block.id} block={block} />);
      i++;
    }
  }

  return nodes;
}

export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  return <div className="text-base">{renderBlocks(blocks)}</div>;
}