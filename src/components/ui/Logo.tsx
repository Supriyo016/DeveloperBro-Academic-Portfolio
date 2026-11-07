export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#3a3eb4" />
      <path
        fillRule="evenodd"
        fill="#fffdf8"
        d="M10 10h14c9 0 15 6 15 14s-6 14-15 14H10ZM16 16v16h8c5.5 0 9-3.5 9-8s-3.5-8-9-8Z"
      />
      <path d="M20 19.5l5.5 4.5-5.5 4.5" fill="none" stroke="#74d3e2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40.5" cy="38" r="3.5" fill="#74d3e2" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      DeveloperBro<span className="text-accent">.</span>
    </span>
  );
}
