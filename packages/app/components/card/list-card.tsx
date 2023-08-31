import { Suspense, useMemo, useCallback, ReactNode } from "react";
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { ResizeMode } from "expo-av";
import { Link, LinkProps } from "solito/link";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedByReduced } from "app/components/feed-item/claimed-by";
import { ListMedia } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { NFTDropdown } from "app/components/nft-dropdown";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { linkifyDescription } from "app/lib/linkify";
import { NFT } from "app/types";
import { cleanUserTextInput, limitLineBreaks, removeTags } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { NSFWGate } from "../feed-item/nsfw-gate";
import { ContentTypeTooltip } from "../tooltips/content-type-tooltip";

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

const RouteComponentNative = ({
  children,
  onPress,
  ...rest
}: (LinkProps | PressableProps) & {
  onPress: () => void;
  children: ReactNode;
}) => {
  if (isWeb) {
    return <View tw="flex-1">{children}</View>;
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
  tw?: string;
  variant?: "nft" | "activity" | "market";
  as?: string;
  href?: string;
  showClaimButton?: Boolean;
  sizeStyle?: { width: number; height: number };
  style?: StyleProp<ViewStyle>;
  index: number;
};

function ListCard(props: Props) {
  const { width } = useWindowDimensions();
  const isLgWidth = width >= breakpoints["md"];

  if (!isLgWidth) {
    return <ListCardSmallScreen {...props} />;
  }

  return <ListCardLargeScreen {...props} />;
}

const ListCardSmallScreen = ({
  nft,
  tw = "",
  sizeStyle,
  href = "",
  onPress,
  as,
  index,
}: Props) => {
  const isDark = useIsDarkMode();

  const handleOnPress = useCallback(() => {
    if (isWeb) return null;
    onPress?.();
  }, [onPress]);

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
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(removeTags(nft?.token_description))
            )
          )
        : "",
    [nft?.token_description]
  );

  return (
    <RouteComponentNative href={href} as={as} onPress={handleOnPress}>
      <View
        // @ts-expect-error TODO: add accessibility types for RNW
        dataset={Platform.select({ web: { testId: "nft-card-list" } })}
        style={[sizeStyle]}
        tw={[
          "mx-2 my-2 md:mx-0",
          nft?.loading ? "opacity-50" : "opacity-100",
          "flex-1 overflow-hidden rounded-lg",
          "bg-gray-50 dark:bg-gray-900 md:dark:bg-black",
          tw,
        ]}
      >
        <View tw="flex-row items-center justify-between border-b-0 bg-gray-200 px-2 dark:bg-gray-800">
          <Creator
            nft={nft}
            shouldShowDateCreated={false}
            shouldShowCreatorIndicator={false}
            size={24}
            timeLimit={edition?.time_limit}
            tw={"web:py-2 py-2"}
          />
          <View tw="items-center">
            <ErrorBoundary renderFallback={() => null}>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  nft={detailData?.data.item ?? nft}
                  edition={edition}
                  iconSize={18}
                  iconColor={isDark ? "white" : "black"}
                />
              </Suspense>
            </ErrorBoundary>
          </View>
        </View>
        <View tw="flex-row pb-2 pt-2">
          <View tw="relative ml-2">
            <RouteComponent
              viewProps={{
                style: {
                  width: "100%",
                  height: "100%",
                },
              }}
              as={as}
              href={href}
              onPress={handleOnPress}
            >
              <View tw="h-24 w-24 items-center justify-center bg-gray-300 dark:bg-gray-700 sm:h-36 sm:w-36">
                <ListMedia
                  item={nft}
                  resizeMode={ResizeMode.COVER}
                  loading={index > 0 ? "lazy" : "eager"}
                />
                <NSFWGate
                  show={nft.nsfw}
                  nftId={nft.nft_id}
                  variant="thumbnail"
                />
              </View>
            </RouteComponent>
          </View>

          <View tw="flex-1 justify-between">
            <View tw="px-2">
              <View tw="py-2">
                <RouteComponent as={as} href={href} onPress={handleOnPress}>
                  <Text
                    tw="overflow-ellipsis whitespace-nowrap text-base font-bold text-black dark:text-white"
                    numberOfLines={1}
                  >
                    {nft.token_name}
                  </Text>
                </RouteComponent>

                {description ? (
                  <View tw="mt-3">
                    <Text
                      tw="text-xs text-gray-600 dark:text-gray-400"
                      numberOfLines={2}
                    >
                      {description}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View tw="h-6 justify-between px-2">
              <ClaimedByReduced
                claimersList={detailData?.data.item?.multiple_owners_list}
                nft={nft}
              />
            </View>
          </View>
        </View>
        <View tw="h-12 flex-row items-center bg-gray-200 px-2 dark:bg-gray-800">
          {!!nft.creator_airdrop_edition_address && edition ? (
            <ClaimButton edition={edition} nft={nft} size="small" tw="flex-1" />
          ) : null}
        </View>
      </View>
    </RouteComponentNative>
  );
};

const ListCardLargeScreen = ({
  nft,
  tw = "",
  sizeStyle,
  href = "",
  showClaimButton,
  onPress,
  as,
  index,
}: Props) => {
  const { width } = useWindowDimensions();
  const isLgWidth = width >= breakpoints["lg"];

  const handleOnPress = useCallback(() => {
    if (isWeb) return null;
    onPress?.();
  }, [onPress]);

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
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(removeTags(nft?.token_description))
            )
          )
        : "",
    [nft?.token_description]
  );

  return (
    <View
      role="article"
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
            as={as}
          >
            <View tw="h-full min-h-[240px] w-60 items-center">
              <ListMedia
                item={nft}
                resizeMode={ResizeMode.COVER}
                optimizedWidth={480}
                loading={index > 0 ? "lazy" : "eager"}
              />
              <NSFWGate
                show={nft.nsfw}
                nftId={nft.nft_id}
                variant="thumbnail"
              />
            </View>
          </RouteComponent>

          <View tw="z-9 absolute bottom-3 left-2">
            <ContentTypeTooltip edition={edition} />
          </View>
        </View>

        <View tw="flex-1 justify-between">
          <View tw="pr-6">
            <View tw="px-4">
              <Creator
                nft={nft}
                shouldShowDateCreated={false}
                timeLimit={edition?.time_limit}
              />
              <RouteComponent as={as} href={href!} onPress={handleOnPress}>
                <View tw="inline flex-grow-0">
                  <Text
                    tw="inline-block overflow-ellipsis whitespace-nowrap text-lg font-bold text-black dark:text-white"
                    numberOfLines={1}
                  >
                    {nft.token_name}
                  </Text>
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

          <View tw="mb-4 mt-4 h-12 justify-between space-y-2 px-4">
            {detailData?.data?.item?.multiple_owners_list &&
            detailData.data.item.multiple_owners_list.length > 0 ? (
              <ClaimedByReduced
                claimersList={detailData?.data.item?.multiple_owners_list}
                nft={nft}
                size="regular"
              />
            ) : null}
          </View>
        </View>
        <View tw="ml-8 mr-4 min-w-[140px] self-center lg:min-w-[200px]">
          <View tw="flex-row self-end">
            {showClaimButton &&
            !!nft.creator_airdrop_edition_address &&
            edition ? (
              <>
                <ClaimButton edition={edition} nft={nft} size="regular" />
                <ClaimedShareButton
                  tw="ml-3 hidden lg:flex"
                  edition={edition}
                  size="regular"
                  nft={nft}
                />
              </>
            ) : null}
          </View>
        </View>
        <View tw="self-center">
          <ErrorBoundary renderFallback={() => null}>
            <Suspense fallback={<Skeleton width={24} height={24} />}>
              <NFTDropdown
                nft={detailData?.data.item ?? nft}
                edition={edition}
              />
            </Suspense>
          </ErrorBoundary>
        </View>
      </View>
    </View>
  );
};

const MemoizedListCard = withMemoAndColorScheme<typeof ListCard, Props>(
  ListCard
);

export { MemoizedListCard as ListCard };
