import { Activity } from "app/components/activity";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";

import { Grid } from "design-system/card/grid";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";
import { Social } from "design-system/card/social";
// import { Owner } from "design-system/card/rows/owner";
import { Media } from "design-system/media";
import { View } from "design-system/view";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function CardImpl({ act, variant }: Props) {
  const { id, nfts, actor } = act;
  const single = act.nfts?.length === 1;

  return (
    <>
      <View tw="pt-2 bg-white dark:bg-black" shouldRasterizeIOS={true}>
        {variant === "activity" && <Activity activity={act} />}

        <View tw="py-2">
          {single ? (
            <Media item={nfts[0]} numColumns={1} />
          ) : (
            <Grid nfts={nfts ?? []} />
          )}
        </View>

        {variant === "nft" && <Title nft={nfts[0]} />}

        {single && <Social nft={nfts[0]} />}

        {/* <Owner nft={nfts[0]} price={true} /> */}

        {single && (
          <>
            <View tw="h-[1px] mx-4 bg-gray-100 dark:bg-gray-900" />
            <Collection nft={nfts[0]} />
          </>
        )}
      </View>
      <View tw="bg-gray-200 dark:bg-gray-800 h-4 lg:hidden" />
    </>
  );
}

export const Card = withMemoAndColorScheme(CardImpl);
