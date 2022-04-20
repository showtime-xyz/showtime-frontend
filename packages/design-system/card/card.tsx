import { Platform, useWindowDimensions } from "react-native";

// import { Activity } from "app/components/activity";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { NFT } from "app/types";

// import { Grid } from "design-system/card/grid";
import { Collection } from "design-system/card/rows/collection";
import { Creator } from "design-system/card/rows/elements/creator";
import { Owner } from "design-system/card/rows/owner";
import { Title } from "design-system/card/rows/title";
import { Social } from "design-system/card/social";
import { Media } from "design-system/media";
import { Pressable } from "design-system/pressable-scale";
import { View } from "design-system/view";

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns: number;
  tw?: string;
  variant: "nft" | "activity" | "market";
};

function Card({ nft, numColumns, tw, onPress }: Props) {
  const { width } = useWindowDimensions();

  if (width < 768) {
    return (
      <Pressable onPress={onPress}>
        <Media item={nft} numColumns={numColumns} />
      </Pressable>
    );
  }

  const size = tw
    ? tw
    : numColumns === 3
    ? "w-[350px] max-w-[30vw]"
    : numColumns === 2
    ? "w-[50vw]"
    : "w-[100vw]";

  return (
    <View
      tw={[
        size,
        // numColumns >= 3 ? "m-4" : numColumns === 2 ? "m-2" : "",
        nft?.loading ? "opacity-50" : "opacity-100",
        "shadow-md rounded-2xl overflow-hidden",
        "self-center justify-self-center",
      ]}
    >
      <View tw="bg-white dark:bg-black" shouldRasterizeIOS={true}>
        {/* {variant === "activity" && <Activity activity={act} />} */}
        <Creator nft={nft} />

        <View tw="py-2">
          <Pressable onPress={onPress}>
            <Media item={nft} numColumns={numColumns} />
          </Pressable>
          {/* <Grid nfts={nfts ?? []} /> */}
        </View>

        <Pressable onPress={onPress}>
          <Title nft={nft} />
        </Pressable>

        <Social nft={nft} />

        <Owner nft={nft} price={Platform.OS !== "ios"} />

        <View tw="h-[1px] mx-4 bg-gray-100 dark:bg-gray-900" />
        <Collection nft={nft} />
      </View>
      {/* <View tw="bg-gray-200 dark:bg-gray-800 h-4 lg:hidden" /> */}
    </View>
  );
}

const MemoizedCard = withMemoAndColorScheme(Card);

export { MemoizedCard as Card };
