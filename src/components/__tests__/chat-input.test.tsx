import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatInput } from "../chat-input";

function renderChatInput(overrides = {}) {
  const props = {
    input: "",
    setInput: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
    onStop: vi.fn(),
    ...overrides,
  };
  const result = render(<ChatInput {...props} />);
  return { ...result, props };
}

describe("ChatInput", () => {
  it("renders textarea and Send button", () => {
    renderChatInput();
    expect(
      screen.getByPlaceholderText("Type a message..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("Send button is disabled when input is empty", () => {
    renderChatInput({ input: "" });
    expect(screen.getByText("Send")).toBeDisabled();
  });

  it("Send button is enabled when input has text", () => {
    renderChatInput({ input: "Hello" });
    expect(screen.getByText("Send")).toBeEnabled();
  });

  it("clicking Send calls onSubmit", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ input: "Hello" });

    await user.click(screen.getByText("Send"));
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it("clicking Send does not call onSubmit when input is empty", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ input: "" });

    // Button is disabled, so click should not fire onSubmit
    await user.click(screen.getByText("Send"));
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("Enter key calls onSubmit when input has text", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ input: "Hello" });

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.click(textarea);
    await user.keyboard("{Enter}");
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it("Shift+Enter does not call onSubmit", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ input: "Hello" });

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.click(textarea);
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("Enter does not call onSubmit when isLoading", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ input: "Hello", isLoading: true });

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.click(textarea);
    await user.keyboard("{Enter}");
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("shows Stop button when isLoading", () => {
    renderChatInput({ isLoading: true });
    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.queryByText("Send")).not.toBeInTheDocument();
  });

  it("Stop button calls onStop", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput({ isLoading: true });

    await user.click(screen.getByText("Stop"));
    expect(props.onStop).toHaveBeenCalledOnce();
  });

  it("typing calls setInput", async () => {
    const user = userEvent.setup();
    const { props } = renderChatInput();

    const textarea = screen.getByPlaceholderText("Type a message...");
    await user.type(textarea, "H");
    expect(props.setInput).toHaveBeenCalled();
  });
});
