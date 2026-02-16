import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createConversation,
  listConversations,
  getMessages,
  saveMessage,
  updateConversationTitle,
  deleteConversation,
} from "@/lib/db";
import { createUIMessage } from "@/test/helpers";

// Mock the supabase client
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "@/lib/supabase";

function setupChain(overrides: Record<string, unknown> = {}) {
  // Reset all mocks and set up default chaining
  mockEq.mockReturnThis();
  mockOrder.mockReturnThis();
  mockSelect.mockReturnThis();
  mockSingle.mockReturnThis();
  mockInsert.mockReturnThis();
  mockUpsert.mockReturnThis();
  mockUpdate.mockReturnThis();
  mockDelete.mockReturnThis();

  // Apply overrides
  for (const [key, value] of Object.entries(overrides)) {
    const mockMap: Record<string, ReturnType<typeof vi.fn>> = {
      eq: mockEq,
      order: mockOrder,
      select: mockSelect,
      single: mockSingle,
      insert: mockInsert,
      upsert: mockUpsert,
      update: mockUpdate,
      delete: mockDelete,
    };
    if (mockMap[key]) mockMap[key].mockReturnValue(value);
  }

  vi.mocked(supabase.from).mockReturnValue({
    insert: mockInsert,
    select: mockSelect,
    single: mockSingle,
    upsert: mockUpsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    order: mockOrder,
  } as any);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createConversation", () => {
  it("creates a conversation with given title", async () => {
    const conversation = { id: "1", title: "Hello", created_at: "2024-01-01", updated_at: "2024-01-01" };
    setupChain({
      single: { data: conversation, error: null },
    });

    const result = await createConversation("Hello");

    expect(supabase.from).toHaveBeenCalledWith("conversations");
    expect(mockInsert).toHaveBeenCalledWith({ title: "Hello" });
    expect(result).toEqual(conversation);
  });

  it("defaults title to 'New Chat'", async () => {
    setupChain({
      single: { data: { id: "1", title: "New Chat" }, error: null },
    });

    await createConversation();

    expect(mockInsert).toHaveBeenCalledWith({ title: "New Chat" });
  });

  it("throws on supabase error", async () => {
    setupChain({
      single: { data: null, error: new Error("DB error") },
    });

    await expect(createConversation()).rejects.toThrow("DB error");
  });
});

describe("listConversations", () => {
  it("returns conversations sorted by updated_at desc", async () => {
    const conversations = [
      { id: "2", title: "Second", created_at: "2024-01-02", updated_at: "2024-01-02" },
      { id: "1", title: "First", created_at: "2024-01-01", updated_at: "2024-01-01" },
    ];
    setupChain({
      order: { data: conversations, error: null },
    });

    const result = await listConversations();

    expect(supabase.from).toHaveBeenCalledWith("conversations");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(result).toEqual(conversations);
  });

  it("returns empty array when data is null", async () => {
    setupChain({
      order: { data: null, error: null },
    });

    const result = await listConversations();
    expect(result).toEqual([]);
  });

  it("throws on error", async () => {
    setupChain({
      order: { data: null, error: new Error("fetch error") },
    });

    await expect(listConversations()).rejects.toThrow("fetch error");
  });
});

describe("getMessages", () => {
  it("maps rows to UIMessage format", async () => {
    const rows = [
      { id: "m1", conversation_id: "c1", role: "user", parts: [{ type: "text", text: "Hi" }], created_at: "2024-01-01" },
      { id: "m2", conversation_id: "c1", role: "assistant", parts: [{ type: "text", text: "Hello!" }], created_at: "2024-01-01" },
    ];
    setupChain({
      order: { data: rows, error: null },
    });

    const result = await getMessages("c1");

    expect(supabase.from).toHaveBeenCalledWith("messages");
    expect(mockEq).toHaveBeenCalledWith("conversation_id", "c1");
    expect(result).toEqual([
      { id: "m1", role: "user", parts: [{ type: "text", text: "Hi" }] },
      { id: "m2", role: "assistant", parts: [{ type: "text", text: "Hello!" }] },
    ]);
  });

  it("returns empty array when no messages", async () => {
    setupChain({
      order: { data: null, error: null },
    });

    const result = await getMessages("c1");
    expect(result).toEqual([]);
  });
});

describe("saveMessage", () => {
  it("upserts message and updates conversation timestamp", async () => {
    const message = createUIMessage({ id: "m1", role: "user", text: "Hello" });

    // Need separate from() calls to return different chains
    let callCount = 0;
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      callCount++;
      if (table === "messages") {
        return {
          upsert: vi.fn().mockReturnValue({ error: null }),
        } as any;
      }
      // conversations
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ error: null }),
        }),
      } as any;
    });

    await saveMessage("c1", message);

    expect(supabase.from).toHaveBeenCalledWith("messages");
    expect(supabase.from).toHaveBeenCalledWith("conversations");
  });

  it("throws on upsert error", async () => {
    const message = createUIMessage({ id: "m1" });

    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockReturnValue({ error: new Error("upsert failed") }),
    } as any);

    await expect(saveMessage("c1", message)).rejects.toThrow("upsert failed");
  });
});

describe("updateConversationTitle", () => {
  it("updates the title", async () => {
    setupChain({
      eq: { error: null },
    });

    await updateConversationTitle("c1", "New Title");

    expect(supabase.from).toHaveBeenCalledWith("conversations");
    expect(mockUpdate).toHaveBeenCalledWith({ title: "New Title" });
    expect(mockEq).toHaveBeenCalledWith("id", "c1");
  });

  it("throws on error", async () => {
    setupChain({
      eq: { error: new Error("update failed") },
    });

    await expect(updateConversationTitle("c1", "Title")).rejects.toThrow("update failed");
  });
});

describe("deleteConversation", () => {
  it("deletes by id", async () => {
    setupChain({
      eq: { error: null },
    });

    await deleteConversation("c1");

    expect(supabase.from).toHaveBeenCalledWith("conversations");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "c1");
  });

  it("throws on error", async () => {
    setupChain({
      eq: { error: new Error("delete failed") },
    });

    await expect(deleteConversation("c1")).rejects.toThrow("delete failed");
  });
});
