import type { UIMessage } from "ai";
import { supabase } from "./supabase";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function createConversation(
  title?: string,
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ title: title ?? "New Chat" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMessages(
  conversationId: string,
): Promise<UIMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    role: row.role,
    parts: row.parts,
  })) as UIMessage[];
}

export async function saveMessage(
  conversationId: string,
  message: UIMessage,
): Promise<void> {
  const { error } = await supabase.from("messages").upsert({
    id: message.id,
    conversation_id: conversationId,
    role: message.role,
    parts: message.parts,
  });
  if (error) throw error;

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId);
  if (error) throw error;
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);
  if (error) throw error;
}
