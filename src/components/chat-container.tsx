"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

export function ChatContainer() {
  const { messages, sendMessage, status, stop, setMessages } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    sendMessage({ text });
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full">
      <ChatHeader onNewChat={handleNewChat} />
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
