import { Grid } from "design-system/card/grid";
import { View } from "design-system/view";
import { Activity } from "design-system/activity";
import { Social } from "design-system/card/social";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";
// import { Owner } from "design-system/card/rows/owner";
import { Media } from "design-system/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";

type Props = {
  act: any;
  variant: "nft" | "activity" | "market";
};

function CardImpl({ act, variant }: Props) {
  const { id, nfts, actor } = act;
  const single = act.nfts?.length === 1;

  return (
    <>
      <View tw="py-2 bg-white dark:bg-black" shouldRasterizeIOS={true}>
        {variant === "activity" && <Activity activity={act} />}

        <View tw={"py-2"}>
          {single ? (
            <Media item={nfts[0]} numColumns={1} />
          ) : (
            <Grid nfts={nfts ?? []} />
          )}
        </View>

        {variant === "nft" && <Title nft={nfts[0]} />}

        {single && <Social nft={nfts[0]} />}

        {/* <Owner nft={nfts[0]} price={true} /> */}

        {single && <Collection nft={nfts[0]} />}
      </View>
      <View tw="bg-gray-200 dark:bg-gray-800 h-4 lg:hidden" />
    </>
  );
}

export const Card = withMemoAndColorScheme(CardImpl);
