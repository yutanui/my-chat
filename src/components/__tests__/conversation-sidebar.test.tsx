import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversationSidebar } from "../conversation-sidebar";

vi.mock("@/lib/db", () => ({
  listConversations: vi.fn(),
  deleteConversation: vi.fn(),
}));

import { listConversations, deleteConversation } from "@/lib/db";

const mockConversations = [
  { id: "c1", title: "First Chat", created_at: "2024-01-01", updated_at: "2024-01-02" },
  { id: "c2", title: "Second Chat", created_at: "2024-01-02", updated_at: "2024-01-03" },
];

function renderSidebar(overrides = {}) {
  const props = {
    currentConversationId: null as string | null,
    onSelectConversation: vi.fn(),
    onNewChat: vi.fn(),
    refreshTrigger: 0,
    ...overrides,
  };
  const result = render(<ConversationSidebar {...props} />);
  return { ...result, props };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listConversations).mockResolvedValue(mockConversations);
  vi.mocked(deleteConversation).mockResolvedValue(undefined);
});

describe("ConversationSidebar", () => {
  it("renders New Chat button", () => {
    renderSidebar();
    expect(screen.getByText("+ New Chat")).toBeInTheDocument();
  });

  it("loads and displays conversations on mount", async () => {
    renderSidebar();
    await waitFor(() => {
      expect(screen.getByText("First Chat")).toBeInTheDocument();
      expect(screen.getByText("Second Chat")).toBeInTheDocument();
    });
  });

  it("calls onSelectConversation when clicking a conversation", async () => {
    const user = userEvent.setup();
    const { props } = renderSidebar();

    await waitFor(() => {
      expect(screen.getByText("First Chat")).toBeInTheDocument();
    });

    await user.click(screen.getByText("First Chat"));
    expect(props.onSelectConversation).toHaveBeenCalledWith("c1");
  });

  it("New Chat button calls onNewChat", async () => {
    const user = userEvent.setup();
    const { props } = renderSidebar();

    await user.click(screen.getByText("+ New Chat"));
    expect(props.onNewChat).toHaveBeenCalledOnce();
  });

  it("deletes conversation and removes from list", async () => {
    const user = userEvent.setup();
    renderSidebar();

    await waitFor(() => {
      expect(screen.getByText("First Chat")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("Delete conversation");
    await user.click(deleteButtons[0]);

    expect(deleteConversation).toHaveBeenCalledWith("c1");
    await waitFor(() => {
      expect(screen.queryByText("First Chat")).not.toBeInTheDocument();
    });
  });

  it("calls onNewChat when deleting the active conversation", async () => {
    const user = userEvent.setup();
    const { props } = renderSidebar({ currentConversationId: "c1" });

    await waitFor(() => {
      expect(screen.getByText("First Chat")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("Delete conversation");
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(props.onNewChat).toHaveBeenCalled();
    });
  });

  it("does not call onNewChat when deleting a non-active conversation", async () => {
    const user = userEvent.setup();
    const { props } = renderSidebar({ currentConversationId: "c1" });

    await waitFor(() => {
      expect(screen.getByText("Second Chat")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("Delete conversation");
    await user.click(deleteButtons[1]); // Delete c2, not the active c1

    await waitFor(() => {
      expect(deleteConversation).toHaveBeenCalledWith("c2");
    });
    expect(props.onNewChat).not.toHaveBeenCalled();
  });

  it("reloads conversations when refreshTrigger changes", async () => {
    const { rerender, props } = renderSidebar({ refreshTrigger: 0 });

    await waitFor(() => {
      expect(listConversations).toHaveBeenCalledTimes(1);
    });

    rerender(<ConversationSidebar {...props} refreshTrigger={1} />);

    await waitFor(() => {
      expect(listConversations).toHaveBeenCalledTimes(2);
    });
  });
});
