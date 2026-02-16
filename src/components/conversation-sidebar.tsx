"use client";

import { useEffect, useState } from "react";
import type { Conversation } from "@/lib/db";
import { deleteConversation, listConversations } from "@/lib/db";

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshTrigger: number;
}

export function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  onNewChat,
  refreshTrigger,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger is an intentional trigger prop
  useEffect(() => {
    listConversations()
      .then(setConversations)
      .catch(() => setConversations([]));
  }, [refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === currentConversationId) onNewChat();
  };

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full text-sm px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectConversation(conv.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectConversation(conv.id);
              }
            }}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              conv.id === currentConversationId
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }`}
          >
            <span className="truncate flex-1">{conv.title}</span>
            <button
              type="button"
              onClick={(e) => handleDelete(e, conv.id)}
              className="ml-2 text-gray-400 hover:text-red-500 shrink-0 cursor-pointer"
              aria-label="Delete conversation"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
