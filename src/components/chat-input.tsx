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
    <div className="border-t border-surface-a20 px-4 py-3">
      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-surface-a30 bg-surface-a10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-a0 focus:border-transparent"
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
            className="shrink-0 rounded-xl bg-danger-a0 hover:bg-danger-a10 text-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (input.trim()) onSubmit();
            }}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-primary-a0 hover:bg-primary-a10 disabled:bg-surface-a30 text-surface-a0 px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
