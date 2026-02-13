import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-5-mini"),
    system: "You are a helpful assistant. Be concise and clear.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
