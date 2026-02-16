"use client";

import { useEffect, useState } from "react";
import type { Conversation } from "@/lib/db";
import { deleteConversation, listConversations } from "@/lib/db";

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshTrigger: number;
  isOpen: boolean;
}

export function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  onNewChat,
  refreshTrigger,
  isOpen,
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
    <aside
      className={`${isOpen ? "w-64" : "w-0"} shrink-0 border-r border-surface-a20 h-screen bg-surface-tonal-a0 overflow-hidden transition-all duration-300`}
    >
      <div className="flex flex-col h-full w-64 min-w-64">
        <div className="p-3 border-b border-surface-a20">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full text-sm px-3 py-2 rounded-lg bg-primary-a0 hover:bg-primary-a10 text-surface-a0 transition-colors cursor-pointer"
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
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm hover:bg-surface-tonal-a10 ${
                conv.id === currentConversationId ? "bg-surface-tonal-a10" : ""
              }`}
            >
              <span className="truncate flex-1">{conv.title}</span>
              <button
                type="button"
                onClick={(e) => handleDelete(e, conv.id)}
                className="ml-2 text-surface-a40 hover:text-danger-a10 shrink-0 cursor-pointer"
                aria-label="Delete conversation"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
