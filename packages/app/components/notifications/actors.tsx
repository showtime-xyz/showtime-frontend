import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import type { NotificationItemProp } from "app/components/notifications/notification-item";
import { Actor } from "app/hooks/use-notifications";
import { formatAddressShort } from "app/utilities";

export type ActorsProps = {
  actors: Actor[];
};
export const Actors = ({ actors }: ActorsProps) => {
  if (actors?.length === 1) {
    return (
      <>
        <ActorLink actor={actors[0]} />
      </>
    );
  }
  if (actors?.length === 2) {
    return (
      <>
        <ActorLink actor={actors[0]} /> and <ActorLink actor={actors[1]} />
      </>
    );
  }
  if (actors?.length === 3) {
    return (
      <>
        <ActorLink actor={actors[0]} />, <ActorLink actor={actors[1]} /> and{" "}
        <ActorLink actor={actors[2]} />{" "}
      </>
    );
  }
  if (actors?.length > 3) {
    return (
      <>
        <ActorLink actor={actors[0]} />, <ActorLink actor={actors[1]} />, and{" "}
        <Text tw="text-13 font-bold text-black dark:text-white">
          {actors.length - 2} other{" "}
          {actors.length - 2 == 1 ? "person " : "people "}
        </Text>
      </>
    );
  }
  return null;
};

export const ActorLink = ({
  actor,
}: {
  actor: Pick<Actor, "username" | "wallet_address">;
}) => {
  const router = useRouter();
  return (
    <Text
      tw="text-13 font-bold text-black dark:text-white"
      onPress={() => {
        router.push(`/@${actor.username ?? actor.wallet_address}`);
      }}
    >
      {actor.username ? (
        <>@{actor.username}</>
      ) : (
        <>{formatAddressShort(actor.wallet_address)}</>
      )}
    </Text>
  );
};
