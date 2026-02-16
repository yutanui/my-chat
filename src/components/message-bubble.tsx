import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MessageBubbleProps } from "@/lib/types";

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const textContent =
    message.parts
      ?.filter(
        (part): part is Extract<typeof part, { type: "text" }> =>
          part.type === "text",
      )
      .map((part) => part.text)
      .join("") ?? "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`px-4 ${
          isUser
            ? "py-2 max-w-[75%] rounded-2xl bg-primary-a0 text-surface-a0 rounded-br-md"
            : "py-3 w-full text-light-a0"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{textContent}</p>
        ) : (
          <div className="prose prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
