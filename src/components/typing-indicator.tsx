export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-surface-a10 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-surface-a40 rounded-full [animation:pulse-dot_1.4s_ease-in-out_infinite] [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 bg-surface-a40 rounded-full [animation:pulse-dot_1.4s_ease-in-out_infinite] [animation-delay:200ms]" />
          <span className="w-2.5 h-2.5 bg-surface-a40 rounded-full [animation:pulse-dot_1.4s_ease-in-out_infinite] [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
