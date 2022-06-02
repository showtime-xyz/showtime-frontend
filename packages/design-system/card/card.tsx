import { Suspense, useMemo, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import type { UrlObject } from "url";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import useContentWidth from "app/hooks/use-content-width";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";

import { Collection } from "design-system/card/rows/collection";
import { Creator } from "design-system/card/rows/elements/creator";
import { Owner } from "design-system/card/rows/owner";
import { Title } from "design-system/card/rows/title";
import { Social } from "design-system/card/social";
import { Media } from "design-system/media";
import { CARD_DARK_SHADOW } from "design-system/theme";

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns: number;
  onPress: () => void;
  listId: number | undefined;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  hrefProps?: UrlObject;
};

function Card({ listId, nft, numColumns, tw, onPress, hrefProps }: Props) {
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const contentWidth = useContentWidth();
  const isWeb = Platform.OS === "web";
  const RouteComponent = isWeb ? Link : PressableScale;

  const size = tw
    ? tw
    : numColumns === 3
    ? "w-[350px] max-w-[30vw]"
    : numColumns === 2
    ? "w-[50vw]"
    : "w-[100vw]";

  const cardMaxWidth = useMemo(() => {
    switch (numColumns) {
      case 3:
        return contentWidth / 3;
      case 2:
        return contentWidth / 2;
      default:
        return 500;
    }
  }, [numColumns, contentWidth]);

  const handleOnPress = useCallback(() => {
    if (isWeb) return null;
    onPress?.();
  }, [isWeb, onPress]);

  if (width < 768) {
    return (
      <RouteComponent href={hrefProps} onPress={handleOnPress}>
        <Media item={nft} numColumns={numColumns} />
      </RouteComponent>
    );
  }

  const isCreatorDrop = !!nft.creator_airdrop_edition_address;

  return (
    <LikeContextProvider nft={nft}>
      <View
        style={{
          // @ts-ignore
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
        tw={[
          size,
          numColumns >= 3 ? "m-4" : numColumns === 2 ? "m-2" : "",
          nft?.loading ? "opacity-50" : "opacity-100",
          "overflow-hidden rounded-2xl shadow-lg",
          "self-center justify-self-center",
        ]}
      >
        <View tw="bg-white dark:bg-black" shouldRasterizeIOS={true}>
          {/* {variant === "activity" && <Activity activity={act} />} */}
          <View tw="flex-row items-center justify-between px-4 py-2">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <Suspense fallback={<Skeleton width={24} height={24} />}>
              {!isCreatorDrop ? (
                <NFTDropdown nftId={nft.nft_id} listId={listId} />
              ) : null}
            </Suspense>
          </View>

          <RouteComponent href={hrefProps} onPress={handleOnPress}>
            <Media item={nft} numColumns={numColumns} />
          </RouteComponent>
          <View tw="mt-2">
            <RouteComponent href={hrefProps} onPress={handleOnPress}>
              <Title nft={nft} cardMaxWidth={cardMaxWidth} />
            </RouteComponent>
          </View>

          <Social nft={nft} />

          <Owner nft={nft} price={Platform.OS !== "ios"} />

          <View tw="mx-4 h-[1px] bg-gray-100 dark:bg-gray-900" />
          <Collection nft={nft} />
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme(Card);

export { MemoizedCard as Card };
