import { Avatar, AvatarProps } from "@showtime-xyz/universal.avatar";

import { Link } from "app/navigation/link";

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
