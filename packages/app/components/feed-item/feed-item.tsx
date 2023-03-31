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
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { ResizeMode } from "expo-av";
import { Video as ExpoVideo } from "expo-av";
import Reanimated from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
} from "react-native-reanimated";

import {
  useBlurredBackgroundStyles,
  useIsDarkMode,
} from "@showtime-xyz/universal.hooks";
import { Share } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useNavigation } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { GiftButton } from "../claim/gift-button";
import { ContentTypeTooltip } from "../content-type-tooltip";
import { CommentButton } from "../feed/comment-button";
import { Like } from "../feed/like";
import { SocialButton } from "../social-button";
import { NFTDetails } from "./details";
import { NSFWGate } from "./nsfw-gate";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bottomMargin?: number;
  itemHeight: number;
  setMomentumScrollCallback?: (callback: any) => void;
};
const StatusBarHeight = StatusBar.currentHeight ?? 0;
export const SwiperActiveIndexContext = createContext<number>(0);

export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  bottomPadding = 0,
  bottomMargin = 0,
  itemHeight,
  setMomentumScrollCallback,
}) {
  const lastItemId = useRef(nft.nft_id);
  const detailViewRef = useRef<Reanimated.View>(null);
  const headerHeight = useHeaderHeight();
  const { top } = useSafeAreaInsets();
  const { shareNFT } = useShareNFT();
  const videoRef = useRef<ExpoVideo | null>(null);
  const headerHeightRef = useRef(headerHeight);
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });
  const [detailHeight, setDetailHeight] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation();
  const bottomHeight = usePlatformBottomHeight();
  const isDark = useIsDarkMode();
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
      setDetailHeight(height);
    });
  }

  const blurredBackgroundStyles = useBlurredBackgroundStyles(95);
  const maxContentHeight = windowHeight - bottomHeight;

  const mediaHeight = useMemo(() => {
    const actualHeight =
      windowWidth /
      (isNaN(Number(nft.token_aspect_ratio))
        ? 1
        : Number(nft.token_aspect_ratio));

    if (actualHeight < windowHeight - bottomHeight - headerHeightRef.current) {
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
  const platformHeaderHeight = Platform.select({
    ios: 0,
    default: 0,
  });

  const contentTransY = useDerivedValue(() => {
    const visibleContentHeight =
      windowHeight - detailHeight - StatusBarHeight - headerHeightRef.current;
    if (mediaHeight < visibleContentHeight) {
      return (visibleContentHeight - mediaHeight) / 2;
    } else if (mediaHeight < maxContentHeight - headerHeightRef.current) {
      return top;
    } else {
      return 0;
    }
  }, [
    detailHeight,
    headerHeightRef,
    mediaHeight,
    maxContentHeight,
    top,
    windowHeight,
  ]);

  const detailStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);
  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      transform: [
        {
          translateY: withTiming(contentTransY.value, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
      opacity: withTiming(isLayouted.value, { duration: 500 }),
    };
  });
  const hideHeader = useCallback(() => {
    opacity.value = withTiming(0);
  }, [opacity]);

  const showHeader = useCallback(() => {
    // if (Platform.OS === "ios") {
    //   navigation.setOptions({
    //     headerShown: true,
    //   });
    // }
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
  return (
    <>
      <LikeContextProvider nft={nft}>
        <View tw="w-full" style={{ height: itemHeight, overflow: "hidden" }}>
          <Image
            tw="h-full w-full"
            blurhash={nft.blurhash}
            source={{
              uri: getMediaUrl({ nft, stillPreview: true }),
            }}
            recyclingKey={getMediaUrl({ nft, stillPreview: true })}
            alt={nft.token_name}
          />

          <Animated.View
            style={[
              {
                height: itemHeight - bottomPadding,
                position: "absolute",
              },
              contentStyle,
            ]}
          >
            <FeedItemTapGesture
              videoRef={videoRef}
              toggleHeader={toggleHeader}
              showHeader={showHeader}
              sizeStyle={{
                height: mediaHeight,
                width: windowWidth,
              }}
              isVideo={nft?.mime_type?.startsWith("video")}
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
              />
            </FeedItemTapGesture>
          </Animated.View>

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
            {/* <BlurView
              blurRadius={15}
              style={StyleSheet.absoluteFillObject}
              overlayColor="transparent"
            /> */}
            {nft?.mime_type?.startsWith("video") ? (
              <View tw="z-9 absolute right-4 top-[-30px]">
                <MuteButton />
              </View>
            ) : null}

            <View tw="z-9 absolute -top-[30px] left-2.5">
              <ContentTypeTooltip edition={edition} />
            </View>

            <View
              style={{
                // ...blurredBackgroundStyles,
                // backgroundColor: "rgba(25,25,25,.4)",
                paddingBottom: bottomPadding,
              }}
              tw="overflow-hidden"
            >
              <NFTDetails
                edition={edition}
                nft={nft}
                detail={detailData?.data?.item}
              />
            </View>
            <View tw="absolute bottom-32 right-2 flex-col items-center">
              <AvatarHoverCard
                username={nft?.creator_username || nft?.creator_address_nonens}
                url={nft.creator_img_url}
              />
              <View tw="h-6" />
              <Like vertical nft={nft} />
              <View tw="h-6" />
              <CommentButton vertical nft={nft} />
              <View tw="h-6" />
              <GiftButton vertical nft={nft} />
              <View tw="h-6" />
              <SocialButton onPress={() => shareNFT(nft)}>
                <Share
                  height={24}
                  width={24}
                  color={isDark ? "#FFF" : colors.gray[900]}
                />
              </SocialButton>
            </View>
          </Reanimated.View>
          <View tw="absolute right-4 z-50" style={{ top: top }}>
            <NFTDropdown
              nft={detailData?.data?.item ?? nft}
              edition={edition}
              tw="rounded-full bg-white px-1 py-1 dark:bg-black/60"
            />
          </View>
        </View>
      </LikeContextProvider>

      <NSFWGate nftId={nft.nft_id} show={nft.nsfw} />
    </>
  );
});
FeedItem.displayName = "FeedItem";
