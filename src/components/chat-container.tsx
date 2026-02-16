"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { createConversation, saveMessage } from "@/lib/db";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

interface ChatContainerProps {
  conversationId: string | null;
  initialMessages: UIMessage[];
  onConversationCreated: (id: string) => void;
}

export function ChatContainer({
  conversationId,
  initialMessages,
  onConversationCreated,
}: ChatContainerProps) {
  const [input, setInput] = useState("");
  const activeConversationIdRef = useRef<string | null>(conversationId);
  const prevMessagesLengthRef = useRef(initialMessages.length);

  const { messages, sendMessage, status, stop } = useChat({
    messages: initialMessages,
    onFinish: async ({ message }) => {
      const convId = activeConversationIdRef.current;
      if (!convId) return;
      await saveMessage(convId, message);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Save user messages as they appear
  useEffect(() => {
    const convId = activeConversationIdRef.current;
    if (!convId) return;
    if (messages.length > prevMessagesLengthRef.current) {
      const newMessages = messages.slice(prevMessagesLengthRef.current);
      for (const msg of newMessages) {
        if (msg.role === "user") {
          saveMessage(convId, msg);
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");

    // Create conversation on first message if needed
    if (!activeConversationIdRef.current) {
      const conv = await createConversation(text.slice(0, 100));
      activeConversationIdRef.current = conv.id;
      onConversationCreated(conv.id);
    }

    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full">
      <ChatHeader />
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}
