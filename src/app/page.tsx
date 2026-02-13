"use client";

import { useState, useCallback } from "react";
import type { UIMessage } from "ai";
import { ConversationSidebar } from "@/components/conversation-sidebar";
import { ChatContainer } from "@/components/chat-container";
import { getMessages } from "@/lib/db";

export default function Home() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);

  const handleSelectConversation = useCallback(async (id: string) => {
    const msgs = await getMessages(id);
    setInitialMessages(msgs);
    setConversationId(id);
  }, []);

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setInitialMessages([]);
  }, []);

  const handleConversationCreated = useCallback((id: string) => {
    setConversationId(id);
    setSidebarRefresh((n) => n + 1);
  }, []);

  return (
    <div className="flex h-screen">
      <ConversationSidebar
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        refreshTrigger={sidebarRefresh}
      />
      <main className="flex-1">
        <ChatContainer
          key={conversationId ?? "new"}
          conversationId={conversationId}
          initialMessages={initialMessages}
          onConversationCreated={handleConversationCreated}
        />
      </main>
    </div>
  );
}
