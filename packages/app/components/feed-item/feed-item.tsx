import {
  memo,
  useState,
  useCallback,
  useEffect,
  useMemo,
  createContext,
  useRef,
} from "react";
import {
  Platform,
  StatusBar,
  useWindowDimensions,
  ViewStyle,
  Dimensions,
} from "react-native";

import { ResizeMode } from "expo-av";
import { Video as ExpoVideo } from "expo-av";
import Reanimated from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useUser } from "app/hooks/use-user";
import { getMediaUrl } from "app/utilities";

import { NFTDetails } from "./details";
import { NSFWGate } from "./nsfw-gate";
import { FeedItemProps } from "./type";

const StatusBarHeight = StatusBar.currentHeight ?? 0;
export const SwiperActiveIndexContext = createContext<number | null>(null);
const { height: screenHeight } = Dimensions.get("window");
export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  bottomPadding = 0,
  bottomMargin = 0,
  itemHeight = screenHeight,
  setMomentumScrollCallback,
}) {
  const lastItemId = useRef(nft.nft_id);
  const { isAuthenticated } = useUser();
  const detailViewRef = useRef<Reanimated.View>(null);
  const { top } = useSafeAreaInsets();
  const videoRef = useRef<ExpoVideo | null>(null);

  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });
  const [detailHeight, setDetailHeight] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const bottomHeight = usePlatformBottomHeight();

  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

  const isLayouted = useSharedValue(0);
  const opacity = useSharedValue(1);

  // This part here is important for FlashList, since state gets recycled
  // we need to reset the state when the nft-id changes
  // I had to remove `key` from LikeContextProvider
  // because it was breaking recycling
  // https://shopify.github.io/flash-list/docs/recycling/
  if (nft.nft_id !== lastItemId.current) {
    lastItemId.current = nft.nft_id;
    // since we are recycling, onLayout will not be called again, therefore we need to measure the height manually
    detailViewRef.current?.measure((a, b, width, height) => {
      const cleanedHeight = height && typeof height === "number" ? height : 0;
      setDetailHeight(cleanedHeight);
    });
  }

  const maxContentHeight = windowHeight - bottomHeight;
  const mediaHeight = useMemo(() => {
    const actualHeight =
      windowWidth /
      (isNaN(Number(nft.token_aspect_ratio))
        ? 1
        : Number(nft.token_aspect_ratio));

    if (actualHeight < windowHeight - bottomHeight) {
      return Math.min(actualHeight, maxContentHeight);
    }

    return windowHeight - bottomHeight;
  }, [
    bottomHeight,
    maxContentHeight,
    nft.token_aspect_ratio,
    windowHeight,
    windowWidth,
  ]);

  const contentTransY = useDerivedValue(() => {
    const visibleContentHeight = windowHeight - detailHeight;
    if (mediaHeight < visibleContentHeight) {
      return (
        (visibleContentHeight + bottomPadding - mediaHeight) / 2 +
        StatusBarHeight
      );
    } else if (mediaHeight < maxContentHeight) {
      return top;
    } else {
      return 0;
    }
  }, [detailHeight, mediaHeight, maxContentHeight, top, windowHeight]);

  const detailStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, [opacity]);

  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      transform: [
        {
          translateY: contentTransY.value,
        },
      ],
      opacity: withTiming(isLayouted.value, { duration: 500 }),
    };
  }, [contentTransY, isLayouted]);

  const hideHeader = useCallback(() => {
    opacity.value = withTiming(0);
  }, [opacity]);

  const showHeader = useCallback(() => {
    opacity.value = withTiming(1);
  }, [opacity]);

  const toggleHeader = useCallback(() => {
    if (opacity.value === 1) {
      hideHeader();
    } else {
      showHeader();
    }
  }, [hideHeader, showHeader, opacity]);

  useEffect(() => {
    setMomentumScrollCallback?.(showHeader);
  }, [setMomentumScrollCallback, showHeader]);

  const mediaUrl = useMemo(
    () => ({ uri: getMediaUrl({ nft, stillPreview: true }) }),
    [nft]
  );

  return (
    <>
      <View
        tw="w-full bg-black"
        style={{ height: itemHeight, overflow: "hidden" }}
      >
        <Image
          tw="h-full w-full"
          blurhash={nft.blurhash}
          source={mediaUrl}
          recyclingKey={mediaUrl.uri}
          alt={nft.token_name}
        />

        <FeedItemTapGesture
          videoRef={videoRef}
          toggleHeader={toggleHeader}
          showHeader={showHeader}
          isVideo={nft?.mime_type?.startsWith("video")}
        >
          <Animated.View
            style={[
              {
                height: itemHeight - bottomPadding,
                position: "absolute",
              },
              contentStyle,
            ]}
          >
            <Media
              videoRef={videoRef}
              item={nft}
              numColumns={1}
              sizeStyle={{
                height: mediaHeight,
                width: windowWidth,
              }}
              resizeMode={ResizeMode.COVER}
              onPinchStart={hideHeader}
              onPinchEnd={showHeader}
              theme="dark"
            />
          </Animated.View>
        </FeedItemTapGesture>
        <Reanimated.View
          ref={detailViewRef}
          style={[
            detailStyle,
            {
              bottom: bottomMargin,
              position: "absolute",
              right: 0,
              left: 0,
            },
          ]}
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            isLayouted.value = 1;
            setDetailHeight(height);
          }}
        >
          {nft?.mime_type?.startsWith("video") ? (
            <View tw="z-9 absolute right-4 top-[-30px]">
              <MuteButton />
            </View>
          ) : null}

          <View
            pointerEvents="box-none"
            style={{
              paddingBottom: bottomPadding,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <NFTDetails
              edition={edition}
              nft={nft}
              detail={detailData?.data?.item}
            />
          </View>
        </Reanimated.View>
        {isAuthenticated && (
          <View
            tw="absolute right-4 z-50"
            style={{
              top: Platform.select({
                android: top + 10,
                default: top + 6,
              }),
            }}
          >
            <NFTDropdown
              nft={detailData?.data?.item ?? nft}
              edition={edition}
              tw="rounded-full bg-black/60 px-1 py-1"
            />
          </View>
        )}
      </View>
      <NSFWGate nftId={nft.nft_id} show={nft.nsfw} />
    </>
  );
});
FeedItem.displayName = "FeedItem";
