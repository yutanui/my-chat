# CLAUDE.md

## Project Overview

AI chatbot app with conversation history, built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Vercel AI SDK v4.

## Tech Stack

- **Framework**: Next.js 16 + App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (PostCSS plugin)
- **AI**: Vercel AI SDK v4 (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)
- **Database**: Supabase (conversations + messages tables)
- **Markdown**: react-markdown + remark-gfm
- **Package manager**: pnpm

## Project Structure

```
src/
  app/
    page.tsx              # Main page (client component) — conversation + chat layout
    layout.tsx            # Root layout
    api/chat/route.ts     # POST endpoint — streams OpenAI responses
  components/
    chat-container.tsx    # Wraps useChat hook, orchestrates chat UI
    chat-input.tsx        # Text input + send/stop buttons
    message-list.tsx      # Renders list of messages
    message-bubble.tsx    # Single message display (markdown rendering)
    typing-indicator.tsx  # Loading indicator during streaming
    chat-header.tsx       # Header bar
    conversation-sidebar.tsx  # Sidebar with conversation list
  lib/
    db.ts                 # Supabase CRUD operations (conversations, messages)
    supabase.ts           # Supabase client init
    types.ts              # Shared TypeScript interfaces
```

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint

## AI SDK v4 Conventions

These are critical — the AI SDK v4 API differs significantly from v3:

- Import `useChat` from `@ai-sdk/react` (NOT `ai/react`)
- `useChat` returns `sendMessage`, `status`, `stop`, `messages`, `setMessages`
  - Does NOT return `input`, `setInput`, `handleSubmit`, `isLoading`
- Send messages with `sendMessage({ text: "..." })`
- `status` values: `"ready"`, `"submitted"`, `"streaming"`, `"error"`
- Message type is `UIMessage` (from `ai`), uses `parts` array (`{ type: "text", text: string }`) instead of `content` string
- `convertToModelMessages()` is async — must be awaited
- Server-side streaming: use `toUIMessageStreamResponse()` (NOT `toDataStreamResponse()`)
- Default model: `gpt-5-mini`

## Environment Variables

Required in `.env.local`:
- `OPENAI_API_KEY` — OpenAI API key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key

## Path Aliases

- `@/*` maps to `./src/*`

## Code Style

- Use `"use client"` directive for components that use hooks or browser APIs
- Prefer named exports for components, default export for pages
- Keep API routes minimal — streaming logic only
- Supabase operations go in `src/lib/db.ts`
