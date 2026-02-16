import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createUIMessage } from "@/test/helpers";
import { MessageList } from "../message-list";

describe("MessageList", () => {
  it("renders empty state when no messages", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(
      screen.getByText("Send a message to start chatting"),
    ).toBeInTheDocument();
  });

  it("does not show empty state when messages exist", () => {
    const messages = [createUIMessage({ role: "user", text: "Hi" })];
    render(<MessageList messages={messages} isLoading={false} />);
    expect(
      screen.queryByText("Send a message to start chatting"),
    ).not.toBeInTheDocument();
  });

  it("renders all messages", () => {
    const messages = [
      createUIMessage({ role: "user", text: "Hello" }),
      createUIMessage({ role: "assistant", text: "Hi there" }),
    ];
    render(<MessageList messages={messages} isLoading={false} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("shows typing indicator when loading and last message is user", () => {
    const messages = [createUIMessage({ role: "user", text: "Hi" })];
    const { container } = render(
      <MessageList messages={messages} isLoading={true} />,
    );
    // TypingIndicator renders bouncing dots
    const dots = container.querySelectorAll("[class*='animate-bounce']");
    expect(dots.length).toBe(3);
  });

  it("hides typing indicator when not loading", () => {
    const messages = [createUIMessage({ role: "user", text: "Hi" })];
    const { container } = render(
      <MessageList messages={messages} isLoading={false} />,
    );
    const dots = container.querySelectorAll("[class*='animate-bounce']");
    expect(dots.length).toBe(0);
  });

  it("hides typing indicator when last message is assistant", () => {
    const messages = [
      createUIMessage({ role: "user", text: "Hi" }),
      createUIMessage({ role: "assistant", text: "Hello!" }),
    ];
    const { container } = render(
      <MessageList messages={messages} isLoading={true} />,
    );
    const dots = container.querySelectorAll("[class*='animate-bounce']");
    expect(dots.length).toBe(0);
  });
});
