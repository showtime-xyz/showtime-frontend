import { memo } from "react";
import { Media } from "@showtime/universal-ui.card/media";
import { View } from "@showtime/universal-ui.view";
// import { Activity } from "@showtime/universal-ui.activity";
import { Social } from "@showtime/universal-ui.card/social";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function CardImpl({ act, variant }: Props) {
  const { id, nfts, actor } = act;
  const single = act.nfts?.length === 1;

  return (
    <View tw="bg-white dark:bg-black">
      {/* {variant === "activity" && <Activity activity={act} />} */}
      <Media nfts={nfts ?? []} />
      {single && <Social nft={nfts[0]} />}
    </View>
  );
}

export const Card = memo(CardImpl);
