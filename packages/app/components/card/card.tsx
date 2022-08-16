import { Suspense, useMemo, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Link } from "solito/link";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";

import { CARD_DARK_SHADOW } from "design-system/theme";

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns: number;
  onPress: () => void;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  href?: string;
  showClaimButton?: Boolean;
};

function Card({
  nft,
  numColumns,
  tw,
  onPress,
  href = "",
  showClaimButton = false,
}: Props) {
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const contentWidth = useContentWidth();
  const isWeb = Platform.OS === "web";
  const RouteComponent = isWeb ? Link : PressableScale;
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

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
      <RouteComponent href={href} onPress={handleOnPress}>
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
          numColumns >= 3 ? "my-4" : "",
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
                <NFTDropdown
                  btnProps={{
                    style: tailwind.style("dark:bg-gray-900 bg-gray-100 px-1"),
                    size: "small",
                  }}
                  nft={nft}
                />
              </Suspense>
            </ErrorBoundary>
          </View>

          <RouteComponent href={href!} onPress={handleOnPress}>
            <Media item={nft} numColumns={numColumns} />
          </RouteComponent>
          <RouteComponent
            // @ts-ignore
            dataSet={{ testId: "nft-card-title-link" }}
            href={href!}
            onPress={handleOnPress}
          >
            <Title title={nft.token_name} cardMaxWidth={cardMaxWidth} />
          </RouteComponent>
          <View tw="flex-row justify-between px-4 pt-4">
            <Social nft={nft} />
            {showClaimButton &&
            !!nft.creator_airdrop_edition_address &&
            edition ? (
              <ClaimButton edition={edition} />
            ) : null}
          </View>

          <Owner nft={nft} price={false} />
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme(Card);

export { MemoizedCard as Card };
