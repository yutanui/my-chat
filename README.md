# My Chat

An AI chatbot built with Next.js and OpenAI.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** React 19, [Tailwind CSS 4](https://tailwindcss.com)
- **AI:** [Vercel AI SDK 6](https://ai-sdk.dev) with [OpenAI](https://platform.openai.com) (GPT-5-mini)
- **Database:** [Supabase](https://supabase.com) (conversations + messages)
- **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Linting/Formatting:** [Biome](https://biomejs.dev)
- **Testing:** [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

## Features

- Streaming AI responses in real-time
- Markdown rendering in assistant messages (code blocks, lists, bold, etc.)
- Send with Enter, newline with Shift+Enter
- Auto-expanding textarea input
- Stop button to cancel streaming
- Conversation history with Supabase persistence
- Sidebar for browsing and managing past conversations
- New Chat button to start a new conversation
- Dark mode support
- Auto-scroll to latest message

## Getting Started

1. Create a `.env.local` file with your API keys:

   ```
   OPENAI_API_KEY=sk-your-api-key-here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
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
│   ├── chat-header.tsx          # Title bar
│   ├── conversation-sidebar.tsx # Sidebar with conversation list
│   └── __tests__/               # Component tests
├── lib/
│   ├── db.ts                    # Supabase CRUD operations
│   ├── supabase.ts              # Supabase client init
│   ├── types.ts                 # TypeScript interfaces
│   └── __tests__/               # Unit tests
└── test/
    ├── setup.ts                 # Vitest setup
    └── helpers.ts               # Test utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint + format issues |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
