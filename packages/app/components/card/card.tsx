import { Suspense, useMemo, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Link } from "solito/link";

import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns: number;
  onPress: () => void;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  href?: string;
  showClaimButton?: Boolean;
  sizeStyle?: { width: number; height: number };
};

function Card({
  nft,
  numColumns = 1,
  tw,
  sizeStyle,
  onPress,
  href = "",
  showClaimButton = false,
}: Props) {
  const { width } = useWindowDimensions();
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
  const size = tw
    ? tw
    : numColumns === 3
    ? "w-[350px] max-w-[30vw]"
    : numColumns === 2
    ? "w-[46vw]"
    : "w-[100vw]";

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
        style={[sizeStyle]}
        tw={[
          !sizeStyle ? size : "",
          numColumns > 1 ? "my-4" : "",
          nft?.loading ? "opacity-50" : "opacity-100",
          "overflow-hidden rounded-2xl",
          "dark:shadow-dark shadow-light self-center justify-self-center",
        ]}
      >
        <View tw="bg-white dark:bg-black" shouldRasterizeIOS={true}>
          <View tw="flex-row items-center justify-between px-4">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  btnProps={{
                    tw: "dark:bg-gray-900 bg-gray-100 px-1",
                    size: "small",
                  }}
                  nft={nft}
                />
              </Suspense>
            </ErrorBoundary>
          </View>

          <RouteComponent href={href!} onPress={handleOnPress}>
            <Media item={nft} numColumns={numColumns} />
            {numColumns === 1 && nft?.mime_type?.includes("video") ? (
              <View tw="z-9 absolute bottom-5 right-5">
                <MuteButton />
              </View>
            ) : null}
          </RouteComponent>
          <RouteComponent
            // @ts-ignore
            dataSet={{ testId: "nft-card-title-link" }}
            href={href!}
            onPress={handleOnPress}
          >
            <Title title={nft.token_name} cardMaxWidth={cardMaxWidth} />
          </RouteComponent>
          <View tw="flex-row justify-between p-4">
            <Social nft={nft} />
            {showClaimButton &&
            !!nft.creator_airdrop_edition_address &&
            edition ? (
              <ClaimButton edition={edition} />
            ) : null}
          </View>
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme(Card);

export { MemoizedCard as Card };
