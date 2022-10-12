import { Suspense, useMemo, useCallback } from "react";
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { Link } from "solito/link";

import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { ClaimedBy } from "app/components//feed-item/claimed-by";
import { LikedBy } from "app/components//liked-by";
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
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { NFT } from "app/types";

const isWeb = Platform.OS === "web";
const RouteComponent = isWeb ? Link : PressableScale;

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns: number;
  onPress?: () => void;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  href?: string;
  showClaimButton?: Boolean;
  sizeStyle?: { width: number; height: number };
  style?: StyleProp<ViewStyle>;
};

function Card({
  nft,
  numColumns = 1,
  tw = "",
  sizeStyle,
  onPress,
  href = "",
  showClaimButton = false,
  style,
}: Props) {
  const { width } = useWindowDimensions();
  const contentWidth = useContentWidth();

  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });

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
  }, [onPress]);

  if (width < 768) {
    return (
      <RouteComponent
        href={href}
        viewProps={{ style: [{ flex: 1 }, style] }}
        style={style as any}
        onPress={handleOnPress}
      >
        <Media item={nft} tw={tw} numColumns={numColumns} />
      </RouteComponent>
    );
  }

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        // @ts-ignore
        // TODO: add accessibility types for RNW
        accessibilityRole="article"
        dataSet={Platform.select({ web: { testId: "nft-card" } })}
        style={[sizeStyle]}
        tw={[
          numColumns > 1 ? "my-4" : "",
          nft?.loading ? "opacity-50" : "opacity-100",
          "overflow-hidden rounded-2xl",
          "dark:shadow-dark shadow-light",
          "flex-1",
          tw,
        ]}
      >
        <View tw="bg-white pb-4 dark:bg-black" shouldRasterizeIOS={true}>
          <View tw="flex-row items-center justify-between px-4">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  btnProps={{
                    tw: "dark:bg-gray-900 bg-gray-100 px-1",
                    size: "small",
                  }}
                  nft={detailData?.data.item}
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
            href={href}
            onPress={handleOnPress}
            // @ts-ignore
            dataSet={{ testId: "nft-card-title-link" }}
          >
            <Title title={nft.token_name} cardMaxWidth={cardMaxWidth} />
          </RouteComponent>
          <View tw="flex-row justify-between px-4 py-2">
            <Social nft={nft} />
            {showClaimButton &&
            !!nft.creator_airdrop_edition_address &&
            edition ? (
              <ClaimButton edition={edition} />
            ) : null}
          </View>
          <View tw="flex-row items-center justify-between px-4">
            {numColumns < 3 && <LikedBy nft={nft} />}
            <ClaimedBy
              claimersList={detailData?.data.item?.multiple_owners_list}
              nft={nft}
            />
          </View>
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme<typeof Card, Props>(Card);

export { MemoizedCard as Card };
