import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import type { NotificationItemProp } from "app/components/notifications/notification-item";
import { Actor } from "app/hooks/use-notifications";
import { TextLink } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

export type ActorsProps = {
  actors: Actor[];
} & Pick<NotificationItemProp, "setUsers">;
export const Actors = ({ actors, setUsers }: ActorsProps) => {
  if (actors?.length === 1) {
    return (
      <>
        <ActorLink actor={actors[0]} />{" "}
      </>
    );
  }
  if (actors?.length === 2) {
    return (
      <>
        <ActorLink actor={actors[0]} /> and <ActorLink actor={actors[1]} />{" "}
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
        <Pressable onPress={() => setUsers(actors.slice(2, actors.length))}>
          <Text tw="text-13 font-bold text-black dark:text-white">
            {actors.length - 2} other{" "}
            {actors.length - 2 == 1 ? "person " : "people "}
          </Text>
        </Pressable>
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
    <Pressable
      onPress={() => {
        router.push(`/@${actor.username ?? actor.wallet_address}`);
      }}
    >
      <Text tw="text-13 font-bold text-black dark:text-white">
        {actor.username ? (
          <>@{actor.username}</>
        ) : (
          <>{formatAddressShort(actor.wallet_address)}</>
        )}
      </Text>
    </Pressable>
  );
};
