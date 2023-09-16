import { useRouter } from "@showtime-xyz/universal.router";
import { StockText } from "@showtime-xyz/universal.stock-text";
import { Text } from "@showtime-xyz/universal.text";

import type { NotificationItemProp } from "app/components/notifications/notification-item";
import { Actor } from "app/hooks/use-notifications";
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
        <StockText
          tw="text-13 font-bold text-black dark:text-white"
          onPress={() => setUsers(actors.slice(2, actors.length))}
        >
          {actors.length - 2} other{" "}
          {actors.length - 2 == 1 ? "person " : "people "}
        </StockText>
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
    <StockText
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
    </StockText>
  );
};
