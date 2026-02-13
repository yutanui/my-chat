# My Chat

An AI chatbot built with Next.js and OpenAI.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** React 19, [Tailwind CSS 4](https://tailwindcss.com)
- **AI:** [Vercel AI SDK 6](https://ai-sdk.dev) with [OpenAI](https://platform.openai.com) (GPT-5-mini)
- **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

## Features

- Streaming AI responses in real-time
- Markdown rendering in assistant messages (code blocks, lists, bold, etc.)
- Send with Enter, newline with Shift+Enter
- Auto-expanding textarea input
- Stop button to cancel streaming
- New Chat button to reset conversation
- Dark mode support
- Auto-scroll to latest message

## Getting Started

1. Create a `.env.local` file with your OpenAI API key:

   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

2. Install dependencies and run the dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts       # OpenAI API proxy (streaming)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Tailwind styles
├── components/
│   ├── chat-container.tsx       # Chat orchestrator (useChat hook)
│   ├── message-list.tsx         # Scrollable message history
│   ├── message-bubble.tsx       # User/assistant message bubble
│   ├── chat-input.tsx           # Text input + send/stop button
│   ├── typing-indicator.tsx     # Animated loading dots
│   └── chat-header.tsx          # Title bar + new chat button
└── lib/
    └── types.ts                 # TypeScript interfaces
```
