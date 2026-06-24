/** Profile photo or initials fallback — sizes match LinkedIn avatar scale. */
type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  src?: string;
  alt: string;
  /** Background for initials when no photo is available. */
  color?: string;
  size?: AvatarSize;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  color,
  size = "md",
  className = "",
}: AvatarProps) {
  const classes = ["li-avatar", `li-avatar--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} title={alt} role="img" aria-label={alt}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="li-avatar__img" />
      ) : (
        <span
          className="li-avatar__initials"
          aria-hidden="true"
          style={color ? { background: color } : undefined}
        >
          {getInitials(alt)}
        </span>
      )}
    </div>
  );
}
