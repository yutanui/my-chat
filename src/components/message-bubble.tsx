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
        className={`px-4 py-2 ${
          isUser
            ? "max-w-[75%] rounded-2xl bg-blue-600 text-white rounded-br-md"
            : "w-full text-gray-900 dark:text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{textContent}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
