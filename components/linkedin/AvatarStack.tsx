import Avatar from "./Avatar";

type StackAvatar = {
  id: string;
  name: string;
  src?: string;
  color?: string;
};

type AvatarStackProps = {
  avatars: StackAvatar[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function AvatarStack({
  avatars,
  max = 3,
  size = "sm",
  className = "",
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);

  return (
    <div className={`li-avatar-stack ${className}`.trim()}>
      {visible.map((avatar) => (
        <Avatar
          key={avatar.id}
          name={avatar.name}
          src={avatar.src}
          color={avatar.color}
          size={size}
        />
      ))}
    </div>
  );
}
