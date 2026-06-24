export type ConnectionDegree = "1st" | "2nd" | "3rd+";

type ConnectionBadgeProps = {
  degree: ConnectionDegree;
  className?: string;
};

export default function ConnectionBadge({
  degree,
  className = "",
}: ConnectionBadgeProps) {
  return (
    <span className={`li-connection-badge ${className}`.trim()}>
      · {degree}
    </span>
  );
}
