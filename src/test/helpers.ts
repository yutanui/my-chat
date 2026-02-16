import type { UIMessage } from "ai";

export function createUIMessage(
  overrides: Partial<UIMessage> & { text?: string } = {},
): UIMessage {
  const { text = "Hello", ...rest } = overrides;
  return {
    id: rest.id ?? crypto.randomUUID(),
    role: rest.role ?? "user",
    parts: rest.parts ?? [{ type: "text", text }],
    ...rest,
  } as UIMessage;
}
