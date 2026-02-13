import type { UIMessage } from "ai";

export interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export interface MessageBubbleProps {
  message: UIMessage;
}

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onStop: () => void;
}
