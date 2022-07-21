import { Suspense, useMemo, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import type { UrlObject } from "url";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ErrorBoundary } from "app/components/error-boundary";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useContentWidth } from "app/hooks/use-content-width";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";

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

function Card({ listId, nft, numColumns, tw, onPress, hrefProps = {} }: Props) {
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
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

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        //@ts-ignore
        // TODO: add accessibility types for RNW
        accessibilityRole="article"
        dataSet={Platform.select({ web: { testId: "nft-card" } })}
        style={{
          // @ts-ignore
          boxShadow: colorScheme === "dark" ? CARD_DARK_SHADOW : undefined,
        }}
        tw={[
          size,
          numColumns >= 3 ? "mt-8" : numColumns === 2 ? "m-2" : "",
          nft?.loading ? "opacity-50" : "opacity-100",
          "overflow-hidden rounded-2xl shadow-lg",
          "self-center justify-self-center",
        ]}
      >
        <View tw="bg-white dark:bg-black" shouldRasterizeIOS={true}>
          {/* {variant === "activity" && <Activity activity={act} />} */}
          <View tw="flex-row items-center justify-between px-4">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown nft={nft} listId={listId} />
              </Suspense>
            </ErrorBoundary>
          </View>

          <RouteComponent href={hrefProps!} onPress={handleOnPress}>
            <Media item={nft} numColumns={numColumns} />
          </RouteComponent>
          <RouteComponent
            dataSet={{ testId: "nft-card-title-link" }}
            href={hrefProps!}
            onPress={handleOnPress}
          >
            <Title nft={nft} cardMaxWidth={cardMaxWidth} />
          </RouteComponent>

          <Social nft={nft} />

          <Owner nft={nft} price={false} />
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme(Card);

export { MemoizedCard as Card };
