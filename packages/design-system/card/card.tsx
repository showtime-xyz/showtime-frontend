import { Media } from "design-system/card/media";
import { View } from "design-system/view";
import { Activity } from "design-system/activity";
import { Social } from "design-system/card/social";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function Card({ act, variant }: Props) {
  const { id, nfts, actor } = act;
  const single = act.nfts?.length === 1;

  return (
    <View tw="bg-white dark:bg-black">
      {variant === "activity" && <Activity activity={act} />}
      <Media nfts={nfts} />
      {single && <Social nft={nfts[0]} />}
    </View>
  );
}

export { Card };
