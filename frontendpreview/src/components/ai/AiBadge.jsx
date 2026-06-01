export function AiSparkle({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.4 4.3L18 8l-4.6 1.7L12 14l-1.4-4.3L6 8l4.6-1.7L12 2z" />
    </svg>
  )
}

export default function AiBadge({ label = 'AI Generated', pulse = false }) {
  return (
    <span className={`ai-badge ${pulse ? 'animate-ai-pulse' : ''}`}>
      <AiSparkle className="h-3.5 w-3.5 text-violet-500" />
      {label}
    </span>
  )
}
