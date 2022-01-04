import { memo } from "react";
import { Media } from "design-system/card/media";
import { View } from "design-system/view";
import { Activity } from "design-system/activity";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function CardImpl({ act, variant }: Props) {
  const { id, nfts, actor } = act;

  return (
    <View tw="bg-white dark:bg-black">
      {variant === "activity" && <Activity activity={act} />}
      <Media nfts={nfts ?? []} />
    </View>
  );
}

export const Card = memo(CardImpl);
