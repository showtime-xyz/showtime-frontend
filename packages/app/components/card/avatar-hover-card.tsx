import { Link } from "app/navigation/link";

import { Avatar, AvatarProps } from "design-system/avatar";

export type AvatarHoverCardProps = Omit<AvatarProps, "alt"> & {
  username: string | undefined | null;
  url: string | undefined | null;
  alt?: string;
};

export function AvatarHoverCard({
  url,
  username,
  ...rest
}: AvatarHoverCardProps) {
  return (
    <Link href={`/@${username}`}>
      <Avatar alt={"Avatar"} url={url} {...rest} />
    </Link>
  );
}
