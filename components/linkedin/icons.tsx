type IconProps = {
  className?: string;
};

export function MessageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v3l3-3h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-1 8H3.41L4 9.59V11h1v-1.59L5.59 9H13V3H3v7h10Z" />
    </svg>
  );
}
