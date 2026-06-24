type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  name: string;
  src?: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
};

const sizeClass: Record<AvatarSize, string> = {
  sm: "li-avatar-sm",
  md: "li-avatar-md",
  lg: "li-avatar-lg",
};

function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Avatar({
  name,
  src,
  color = "#ccc",
  size = "md",
  className = "",
}: AvatarProps) {
  const classes = `li-avatar ${sizeClass[size]} ${className}`.trim();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={classes} />
    );
  }

  return (
    <div
      className={`${classes} li-avatar-initials`}
      style={{ background: color }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
