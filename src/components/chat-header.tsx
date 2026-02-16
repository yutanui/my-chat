interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-surface-a20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="text-surface-a50 hover:text-light-a0 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">My Chat</h1>
      </div>
    </header>
  );
}
