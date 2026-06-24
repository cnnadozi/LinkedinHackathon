/** Inline "· 1st" / "· 2nd" / "· 3rd" badge next to attendee names. */
export type ConnectionDegree = 1 | 2 | 3;

type ConnectionBadgeProps = {
  degree: ConnectionDegree;
  className?: string;
};

const LABELS: Record<ConnectionDegree, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

export function ConnectionBadge({
  degree,
  className = "",
}: ConnectionBadgeProps) {
  const classes = ["li-connection-badge", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-label={`${LABELS[degree]} degree connection`}>
      · {LABELS[degree]}
    </span>
  );
}
