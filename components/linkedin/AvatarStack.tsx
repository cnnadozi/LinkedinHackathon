/** Overlapping attendee avatars with "+N" overflow (e.g. "248 attending" preview). */
import { Avatar, type AvatarProps } from "./Avatar";

type AvatarStackProps = {
  avatars: Pick<AvatarProps, "src" | "alt" | "color">[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
};

export function AvatarStack({
  avatars,
  max = 3,
  size = "sm",
  className = "",
}: AvatarStackProps) {
  const shown = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div
      className={["li-avatar-stack", className].filter(Boolean).join(" ")}
      aria-label={`${avatars.length} attendees`}
    >
      {shown.map((avatar, index) => (
        <div
          key={`${avatar.alt}-${index}`}
          className="li-avatar-stack__item"
          style={{ zIndex: max - index }}
        >
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <span className="li-avatar-stack__overflow" aria-hidden="true">
          +{remaining}
        </span>
      )}
    </div>
  );
}
