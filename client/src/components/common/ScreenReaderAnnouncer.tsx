interface ScreenReaderAnnouncerProps {
  message: string
}

export function ScreenReaderAnnouncer({ message }: ScreenReaderAnnouncerProps) {
  if (!message) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  )
} 