import { Suspense, useMemo, useCallback, ReactNode } from "react";
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { Link, LinkProps } from "solito/link";

import {
  PressableScale,
  Props as PressableScaleProps,
} from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { PlayOnSpotify } from "app/components/play-on-spotify";
import { LikeContextProvider } from "app/context/like-context";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { NFT } from "app/types";

const isWeb = Platform.OS === "web";

const RouteComponent = ({
  children,
  onPress,
  ...rest
}: (LinkProps | PressableScaleProps) & {
  onPress: () => void;
  children: ReactNode;
}) => {
  if (isWeb) {
    return <Link {...(rest as LinkProps)}>{children}</Link>;
  }
  return (
    <PressableScale onPress={onPress} {...(rest as PressableScaleProps)}>
      {children}
    </PressableScale>
  );
};

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns?: number;
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
        return 596;
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
        <Media
          item={nft}
          tw={tw}
          numColumns={numColumns}
          sizeStyle={{
            width: sizeStyle?.width ?? cardMaxWidth,
            height: sizeStyle?.height ?? cardMaxWidth,
          }}
        />
      </RouteComponent>
    );
  }

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        // @ts-ignore
        // TODO: add accessibility types for RNW
        accessibilityRole="article"
        dataset={Platform.select({ web: { testId: "nft-card" } })}
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
                  tw="rounded-full bg-gray-100 p-1 dark:bg-gray-900"
                  nft={detailData?.data.item ?? nft}
                />
              </Suspense>
            </ErrorBoundary>
          </View>

          <RouteComponent href={href!} onPress={handleOnPress}>
            <Media
              item={nft}
              numColumns={numColumns}
              sizeStyle={{
                width: sizeStyle?.width ?? cardMaxWidth,
                height: sizeStyle?.height ?? cardMaxWidth,
              }}
              resizeMode="cover"
            />
            {numColumns === 1 && nft?.mime_type?.includes("video") ? (
              <View tw="z-9 absolute bottom-5 right-5">
                <MuteButton />
              </View>
            ) : null}
            {numColumns === 1 && edition?.spotify_track_url ? (
              <View tw="z-9 absolute bottom-4 left-4">
                <PlayOnSpotify url={edition?.spotify_track_url} />
              </View>
            ) : null}
          </RouteComponent>
          <RouteComponent
            href={href}
            onPress={handleOnPress}
            // @ts-ignore
            dataset={{ testId: "nft-card-title-link" }}
          >
            <Title title={nft.token_name} cardMaxWidth={cardMaxWidth} />
          </RouteComponent>
          <View tw="flex-row justify-between px-4 py-2">
            <Social nft={nft} />
            {showClaimButton &&
            !!nft.creator_airdrop_edition_address &&
            edition ? (
              <View tw="flex-row">
                <ClaimButton edition={edition} />
                <ClaimedShareButton tw="ml-3" edition={edition} />
              </View>
            ) : null}
          </View>
          <ClaimedBy
            claimersList={detailData?.data.item?.multiple_owners_list}
            nft={nft}
            tw="px-4"
          />
        </View>
      </View>
    </LikeContextProvider>
  );
}

const MemoizedCard = withMemoAndColorScheme<typeof Card, Props>(Card);

export { MemoizedCard as Card };
