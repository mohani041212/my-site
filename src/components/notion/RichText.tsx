import { Fragment, type ReactNode } from "react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export default function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((item, i) => {
        const { bold, italic, strikethrough, underline, code } = item.annotations;

        const classes = [
          bold && "font-semibold",
          italic && "italic",
          strikethrough && "line-through",
          underline && "underline",
          code &&
            "rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-pink-600",
        ]
          .filter(Boolean)
          .join(" ");

        let node: ReactNode = classes ? (
          <span className={classes}>{item.plain_text}</span>
        ) : (
          item.plain_text
        );

        if (item.href) {
          node = (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              {node}
            </a>
          );
        }

        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}
