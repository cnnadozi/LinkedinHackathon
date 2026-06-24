import { Avatar, type AvatarProps } from "./Avatar";

type AvatarStackProps = {
  avatars: Pick<AvatarProps, "src" | "alt">[];
  max?: number;
  size?: AvatarProps["size"];
};

export function AvatarStack({
  avatars,
  max = 3,
  size = "sm",
}: AvatarStackProps) {
  const shown = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="li-avatar-stack" aria-label={`${avatars.length} attendees`}>
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
