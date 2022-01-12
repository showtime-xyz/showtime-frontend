import { memo } from "react";
import { Media } from "design-system/card/media";
import { View } from "design-system/view";
import { Activity } from "design-system/activity";
import { Social } from "design-system/card/social";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function CardImpl({ act, variant }: Props) {
  const { id, nfts, actor } = act;
  const single = act.nfts?.length === 1;

  return (
    <View tw="bg-white dark:bg-black">
      {variant === "activity" && <Activity activity={act} />}

      <Media nfts={nfts ?? []} />

      {variant === "nft" && <Title nft={nfts[0]} />}

      {single && <Social nft={nfts[0]} />}

      {single && <Collection nft={nfts[0]} />}

      <View tw="bg-gray-200 dark:bg-gray-800 h-4 lg:hidden" />
    </View>
  );
}

export const Card = memo(CardImpl);
