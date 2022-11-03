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
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import Reanimated from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
} from "react-native-reanimated";

import { useBlurredBackgroundStyles } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { PlayOnSpotify } from "app/components/play-on-spotify";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Blurhash } from "app/lib/blurhash";
import { BlurView } from "app/lib/blurview";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useNavigation } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { NFTDetails } from "./details";

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
  const headerHeight = useHeaderHeight();
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
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

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
    ios: headerHeightRef.current,
    default: 0,
  });
  const contentTransY = useDerivedValue(() => {
    const visibleContentHeight =
      windowHeight - detailHeight - StatusBarHeight - headerHeightRef.current;

    if (mediaHeight < visibleContentHeight) {
      return (visibleContentHeight - mediaHeight) / 2 + platformHeaderHeight;
    } else if (mediaHeight < maxContentHeight - headerHeightRef.current) {
      return platformHeaderHeight;
    } else {
      return 0;
    }
  });
  const isLayouted = useSharedValue(0);
  const opacity = useSharedValue(1);

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
  }, []);
  const hideHeader = useCallback(() => {
    if (Platform.OS !== "ios") return;
    navigation.setOptions({
      headerShown: false,
      headerStyle: {
        opacity: 0,
      },
    });
    opacity.value = withTiming(0);
  }, [navigation, opacity]);

  const showHeader = useCallback(() => {
    if (Platform.OS !== "ios") return;

    navigation.setOptions({
      headerShown: true,
    });
    opacity.value = withTiming(1);
  }, [navigation, opacity]);

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
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View tw="w-full" style={{ height: itemHeight, overflow: "hidden" }}>
        <View>
          {nft.blurhash ? (
            <Blurhash
              blurhash={nft.blurhash}
              decodeWidth={16}
              decodeHeight={16}
              decodeAsync={true}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Image
              tw="h-full w-full"
              source={{
                uri: getMediaUrl({ nft, stillPreview: true }),
              }}
              alt={nft.token_name}
            />
          )}
        </View>

        <FeedItemTapGesture toggleHeader={toggleHeader} showHeader={showHeader}>
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
              item={nft}
              numColumns={1}
              sizeStyle={{
                height: mediaHeight,
                width: windowWidth,
              }}
              resizeMode="cover"
              onPinchStart={hideHeader}
              onPinchEnd={showHeader}
            />
          </Animated.View>
        </FeedItemTapGesture>
        <Reanimated.View
          style={[
            detailStyle,
            {
              bottom: bottomMargin,
              position: "absolute",
              right: 0,
              left: 0,
              zIndex: 1,
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
          <BlurView
            blurRadius={15}
            style={StyleSheet.absoluteFillObject}
            overlayColor="transparent"
          />
          {nft?.mime_type?.startsWith("video") ? (
            <View tw="z-9 absolute top-[-40px] right-4">
              <MuteButton />
            </View>
          ) : null}

          {edition?.spotify_track_url ? (
            <View tw="z-9 absolute top-[-40px] left-4">
              <PlayOnSpotify url={edition?.spotify_track_url} />
            </View>
          ) : null}

          <View
            style={{
              ...blurredBackgroundStyles,
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
        </Reanimated.View>
      </View>
    </LikeContextProvider>
  );
});
FeedItem.displayName = "FeedItem";
