export function MapPinIcon({
  className,
  fill = "var(--color-eucalyptus)",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill={fill}
        d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.62 6.54 11.63 6.82 11.89a1 1 0 0 0 1.36 0c.28-.26 6.82-6.27 6.82-11.89C19.5 5.36 16.14 2 12 2Z"
      />
      <circle cx="12" cy="9.5" r="2.75" fill="var(--color-background)" />
    </svg>
  );
}
