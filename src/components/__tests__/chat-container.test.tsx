import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UIMessage } from "ai";
import { ChatContainer } from "../chat-container";

// Mock the db module
vi.mock("@/lib/db", () => ({
  createConversation: vi.fn(),
  saveMessage: vi.fn(),
}));

// Mock the useChat hook
const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockSetMessages = vi.fn();
let mockMessages: UIMessage[] = [];
let mockStatus = "ready";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn((options?: Record<string, unknown>) => {
    void options;
    return {
      messages: mockMessages,
      sendMessage: mockSendMessage,
      status: mockStatus,
      stop: mockStop,
      setMessages: mockSetMessages,
    };
  }),
}));

import { createConversation, saveMessage } from "@/lib/db";

beforeEach(() => {
  vi.clearAllMocks();
  mockMessages = [];
  mockStatus = "ready";
  vi.mocked(createConversation).mockResolvedValue({
    id: "new-conv",
    title: "Test",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  });
  vi.mocked(saveMessage).mockResolvedValue(undefined);
});

function renderContainer(overrides = {}) {
  const props = {
    conversationId: null as string | null,
    initialMessages: [],
    onConversationCreated: vi.fn(),
    ...overrides,
  };
  const result = render(<ChatContainer {...props} />);
  return { ...result, props };
}

describe("ChatContainer", () => {
  it("renders header, message list, and input", () => {
    renderContainer();
    // Header
    expect(screen.getByText("My Chat")).toBeInTheDocument();
    // Empty message list
    expect(screen.getByText("Send a message to start chatting")).toBeInTheDocument();
    // Input
    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
  });

  it("Send button is disabled when input is empty", () => {
    renderContainer();
    expect(screen.getByText("Send")).toBeDisabled();
  });

  it("typing and sending calls sendMessage", async () => {
    const user = userEvent.setup();
    const { props } = renderContainer();

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.type(textarea, "Hello");
    await user.click(screen.getByText("Send"));

    // Should create conversation first (no conversationId)
    expect(createConversation).toHaveBeenCalledWith("Hello");
    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Hello" });
    expect(props.onConversationCreated).toHaveBeenCalledWith("new-conv");
  });

  it("does not create conversation when conversationId exists", async () => {
    const user = userEvent.setup();
    renderContainer({ conversationId: "existing-conv" });

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.type(textarea, "Hi");
    await user.click(screen.getByText("Send"));

    expect(createConversation).not.toHaveBeenCalled();
    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Hi" });
  });

  it("clears input after submit", async () => {
    const user = userEvent.setup();
    renderContainer({ conversationId: "c1" });

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.type(textarea, "Hello");
    await user.click(screen.getByText("Send"));

    // Input should be cleared
    expect(textarea).toHaveValue("");
  });

  it("does not submit when input is empty", async () => {
    const user = userEvent.setup();
    renderContainer();

    // Button is disabled, but also test Enter key
    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.click(textarea);
    await user.keyboard("{Enter}");

    expect(createConversation).not.toHaveBeenCalled();
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("shows Stop button when streaming", () => {
    mockStatus = "streaming";
    renderContainer();
    expect(screen.getByText("Stop")).toBeInTheDocument();
  });

  it("shows Stop button when submitted", () => {
    mockStatus = "submitted";
    renderContainer();
    expect(screen.getByText("Stop")).toBeInTheDocument();
  });

  it("shows Send button when ready", () => {
    mockStatus = "ready";
    renderContainer();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});
