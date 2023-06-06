import { Suspense, useMemo, useCallback, ReactNode } from "react";
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
  StyleSheet,
} from "react-native";

import { ResizeMode } from "expo-av";
import { Link, LinkProps } from "solito/link";

import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { GridMedia, Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { NFT } from "app/types";

import { ContentTypeTooltip } from "../content-type-tooltip";
import { NSFWGate } from "../feed-item/nsfw-gate";

const isWeb = Platform.OS === "web";

const RouteComponent = ({
  children,
  onPress,
  ...rest
}: (LinkProps | PressableProps) & {
  onPress: () => void;
  children: ReactNode;
}) => {
  if (isWeb) {
    return <Link {...(rest as LinkProps)}>{children}</Link>;
  }
  return (
    <Pressable onPress={onPress} {...(rest as PressableProps)}>
      {children}
    </Pressable>
  );
};

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns?: number;
  onPress?: () => void;
  as?: string;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  href?: string;
  showClaimButton?: Boolean;
  sizeStyle?: { width: number; height: number };
  style?: StyleProp<ViewStyle>;
  index: number;
};

export const GAP = StyleSheet.hairlineWidth;

function Card(props: Props) {
  const {
    nft,
    numColumns = 1,
    tw = "",
    sizeStyle,
    onPress,
    href = "",
    as,
    style,
  } = props;
  const { width } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

  const cardMaxWidth = useMemo(() => {
    const availableSpace = contentWidth - (numColumns - 1) * GAP;
    const itemSize = availableSpace / numColumns;
    switch (numColumns) {
      case 1:
        return 596;
      default:
        return Platform.OS === "web" ? contentWidth / numColumns : itemSize;
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
        as={as}
        viewProps={{ style: [{ flex: 1 }, style] }}
        style={[style as any, { marginBottom: GAP }]}
        onPress={handleOnPress}
      >
        <GridMedia
          item={nft}
          tw={tw}
          numColumns={numColumns}
          sizeStyle={{
            width: sizeStyle?.width ?? cardMaxWidth,
            height: sizeStyle?.height ?? cardMaxWidth,
          }}
          edition={edition}
        />
        <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
      </RouteComponent>
    );
  }

  return (
    <CardLargeScreen
      {...props}
      handleOnPress={handleOnPress}
      cardMaxWidth={cardMaxWidth}
    />
  );
}

const CardLargeScreen = ({
  nft,
  numColumns = 1,
  tw = "",
  sizeStyle,
  href = "",
  as,
  showClaimButton,
  handleOnPress,
  cardMaxWidth,
  index,
}: Props & { handleOnPress: any; cardMaxWidth: number }) => {
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });
  return (
    <LikeContextProvider nft={nft}>
      <View
        role="article"
        // @ts-ignore
        dataset={Platform.select({ web: { testId: "nft-card" } })}
        style={[sizeStyle]}
        tw={[
          numColumns > 1 ? "my-4" : "",
          nft?.loading ? "opacity-50" : "opacity-100",
          "overflow-hidden rounded-2xl",
          "flex-1",
          "shadow-light bg-white dark:bg-black",
          tw,
        ]}
      >
        <View tw="pb-4">
          <View tw="flex-row items-center justify-between px-4">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  tw="rounded-full bg-gray-100 p-1 dark:bg-gray-900"
                  nft={detailData?.data.item ?? nft}
                  edition={edition}
                />
              </Suspense>
            </ErrorBoundary>
          </View>

          <RouteComponent href={href!} as={as} onPress={handleOnPress}>
            <Media
              item={nft}
              numColumns={numColumns}
              sizeStyle={{
                width: sizeStyle?.width ?? cardMaxWidth,
                height: sizeStyle?.height ?? cardMaxWidth,
              }}
              resizeMode={ResizeMode.COVER}
              optimizedWidth={600}
              loading={index > 0 ? "lazy" : "eager"}
              withVideoBackdrop
            />
            <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
            {numColumns === 1 && nft?.mime_type?.includes("video") ? (
              <View tw="z-9 absolute left-4 top-5">
                <MuteButton />
              </View>
            ) : null}
            <View tw="z-9 absolute bottom-2.5 left-2.5">
              <ContentTypeTooltip edition={edition} />
            </View>
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
                <ClaimedShareButton tw="ml-3" edition={edition} nft={nft} />
              </View>
            ) : null}
          </View>
          <View tw="h-5">
            <ClaimedBy
              claimersList={detailData?.data.item?.multiple_owners_list}
              nft={nft}
              tw="px-4"
            />
          </View>
        </View>
      </View>
    </LikeContextProvider>
  );
};

const MemoizedCard = withMemoAndColorScheme<typeof Card, Props>(Card);

export { MemoizedCard as Card };
