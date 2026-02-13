"use client";

import type { ChatInputProps } from "@/lib/types";

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ maxHeight: "150px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
          }}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="shrink-0 rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { if (input.trim()) onSubmit(); }}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
