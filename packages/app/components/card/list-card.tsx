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

import { Button } from "@showtime-xyz/universal.button";
import {
  PressableScale,
  Props as PressableScaleProps,
} from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Title } from "app/components/card/rows/title";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedBy, ClaimedByBig } from "app/components/feed-item/claimed-by";
import { Like } from "app/components/feed/like";
import { ListMedia } from "app/components/media/";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { linkifyDescription } from "app/lib/linkify";
import { NFT } from "app/types";
import { removeTags } from "app/utilities";

import { Hidden } from "design-system/hidden";
import { breakpoints } from "design-system/theme";

import { ContentTypeTooltip } from "../content-type-tooltip";
import { NSFWGate } from "../feed-item/nsfw-gate";

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

function ListCard(props: Props) {
  const { nft, tw = "", sizeStyle, onPress, href = "", style } = props;
  const { width } = useWindowDimensions();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

  const handleOnPress = useCallback(() => {
    if (isWeb) return null;
    onPress?.();
  }, [onPress]);

  /*
  if (width < 768) {
    return (
      <RouteComponent
        href={href}
        viewProps={{ style: [{ flex: 1 }, style] }}
        style={[style as any]}
        onPress={handleOnPress}
      >
        <Media
          item={nft}
          tw={tw}
          sizeStyle={{
            width: sizeStyle?.width,
            height: sizeStyle?.height,
          }}
          edition={edition}
        />
        <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
      </RouteComponent>
    );
  }
  */

  return <ListCardLargeScreen {...props} handleOnPress={handleOnPress} />;
}

const ListCardLargeScreen = ({
  nft,
  tw = "",
  sizeStyle,
  href = "",
  showClaimButton,
  handleOnPress,
}: Props & { handleOnPress: any }) => {
  const { width } = useWindowDimensions();
  const isLgWidth = width >= breakpoints["lg"];

  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });

  const description = useMemo(
    () =>
      nft?.token_description
        ? linkifyDescription(removeTags(nft?.token_description))
        : "",
    [nft?.token_description]
  );

  return (
    <View
      // @ts-expect-error TODO: add accessibility types for RNW
      //accessibilityRole="article"
      dataset={Platform.select({ web: { testId: "nft-card" } })}
      style={[sizeStyle]}
      tw={[
        "mx-4 my-2 md:mx-0",
        nft?.loading ? "opacity-50" : "opacity-100",
        "overflow-hidden rounded-2xl",
        "flex-1",
        "bg-white dark:bg-gray-900 md:dark:bg-black",
        tw,
      ]}
    >
      <View tw="flex-row pr-4">
        <View tw="relative bg-gray-200 dark:bg-gray-800">
          <RouteComponent
            href={href!}
            onPress={handleOnPress}
            viewProps={{
              style: {
                height: "100%",
              },
            }}
          >
            <View tw="h-full min-h-[240px] w-60 items-center">
              <ListMedia item={nft} resizeMode={ResizeMode.COVER} />
              <NSFWGate
                show={nft.nsfw}
                nftId={nft.nft_id}
                variant="thumbnail"
              />
            </View>
          </RouteComponent>

          <View tw="z-9 absolute bottom-4 left-4 ">
            <ContentTypeTooltip edition={edition} />
          </View>
        </View>

        <View tw="flex-1 justify-between">
          <View tw="pr-6">
            <View tw="px-4">
              <Creator nft={nft} shouldShowDateCreated={false} />
              <RouteComponent href={href!} onPress={handleOnPress}>
                <View tw="inline flex-grow-0">
                  <Title
                    tw="inline-flex flex-grow-0 pt-0"
                    title={nft.token_name}
                  />
                </View>
              </RouteComponent>
              <View tw="mt-2 min-h-fit">
                {description ? (
                  <Text
                    tw="text-sm text-gray-600 dark:text-gray-400"
                    numberOfLines={isLgWidth ? 5 : 3}
                  >
                    {description}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View tw="mb-4 mt-4 justify-between space-y-2 px-4">
            <ClaimedByBig
              claimersList={detailData?.data.item?.multiple_owners_list}
              nft={nft}
            />
          </View>
        </View>
        <View tw="mx-4 w-1/5 self-center">
          {showClaimButton &&
          !!nft.creator_airdrop_edition_address &&
          edition ? (
            <View tw="flex-row self-end">
              <ClaimButton edition={edition} size="regular" />
              <ClaimedShareButton
                tw="ml-3 w-1/3"
                edition={edition}
                size="regular"
              />
            </View>
          ) : null}
        </View>
        <Hidden until="md">
          <View tw="mt-4 lg:mt-0 lg:self-center">
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  nft={detailData?.data.item ?? nft}
                  edition={edition}
                />
              </Suspense>
            </ErrorBoundary>
          </View>
        </Hidden>
      </View>
    </View>
  );
};

const MemoizedListCard = withMemoAndColorScheme<typeof ListCard, Props>(
  ListCard
);

export { MemoizedListCard as ListCard };
