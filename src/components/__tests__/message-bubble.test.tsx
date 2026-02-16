import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createUIMessage } from "@/test/helpers";
import { MessageBubble } from "../message-bubble";

describe("MessageBubble", () => {
  it("extracts and renders text from a single text part", () => {
    const message = createUIMessage({ role: "user", text: "Hello world" });
    render(<MessageBubble message={message} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("concatenates multiple text parts", () => {
    const message = createUIMessage({
      role: "user",
      parts: [
        { type: "text", text: "Hello " },
        { type: "text", text: "world" },
      ],
    });
    render(<MessageBubble message={message} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders empty string when parts array is empty", () => {
    const message = createUIMessage({ role: "user", parts: [] });
    const { container } = render(<MessageBubble message={message} />);
    // Should render without crashing, with empty text
    const p = container.querySelector("p");
    expect(p).toBeInTheDocument();
    expect(p?.textContent).toBe("");
  });

  it("renders user message with right alignment", () => {
    const message = createUIMessage({ role: "user", text: "Hi" });
    const { container } = render(<MessageBubble message={message} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("justify-end");
  });

  it("renders assistant message with left alignment", () => {
    const message = createUIMessage({ role: "assistant", text: "Hello!" });
    const { container } = render(<MessageBubble message={message} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("justify-start");
  });

  it("renders user message with blue background", () => {
    const message = createUIMessage({ role: "user", text: "Hi" });
    const { container } = render(<MessageBubble message={message} />);
    const bubble = container.querySelector("[class*='bg-blue-600']");
    expect(bubble).toBeInTheDocument();
  });

  it("renders assistant message with gray background", () => {
    const message = createUIMessage({ role: "assistant", text: "Hello!" });
    const { container } = render(<MessageBubble message={message} />);
    const bubble = container.querySelector("[class*='bg-gray-100']");
    expect(bubble).toBeInTheDocument();
  });

  it("renders user message as plain text (not markdown)", () => {
    const message = createUIMessage({ role: "user", text: "**bold**" });
    render(<MessageBubble message={message} />);
    // User messages use <p>, not ReactMarkdown
    expect(screen.getByText("**bold**")).toBeInTheDocument();
  });
});
