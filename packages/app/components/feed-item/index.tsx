import { memo, useState, useCallback, useEffect, useMemo } from "react";
import {
  Platform,
  StatusBar,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { BlurView } from "expo-blur";
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
import { Image } from "@showtime-xyz/universal.image";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Blurhash } from "app/lib/blurhash";
import { useNavigation } from "app/lib/react-navigation/native";
import { useMuted } from "app/providers/mute-provider";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { NFTDetails } from "./details";
import { FeedItemMD } from "./feed-item.md";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bottomMargin?: number;
  headerHeight?: number;
  itemHeight: number;
  setMomentumScrollCallback?: (callback: any) => void;
};
const StatusBarHeight = StatusBar.currentHeight ?? 0;

export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  bottomPadding = 0,
  bottomMargin = 0,
  headerHeight = 0,
  itemHeight,
  setMomentumScrollCallback,
}) {
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

    if (actualHeight < windowHeight - bottomHeight - headerHeight) {
      return Math.min(actualHeight, maxContentHeight);
    }

    return windowHeight - bottomHeight;
  }, [
    bottomHeight,
    headerHeight,
    maxContentHeight,
    nft.token_aspect_ratio,
    windowHeight,
    windowWidth,
  ]);
  const platformHeaderHeight = Platform.select({
    ios: headerHeight,
    default: 0,
  });
  const contentTransY = useDerivedValue(() => {
    const visibleContentHeight =
      windowHeight - headerHeight - detailHeight - StatusBarHeight;

    if (mediaHeight < visibleContentHeight) {
      return (visibleContentHeight - mediaHeight) / 2 + platformHeaderHeight;
    } else if (mediaHeight < maxContentHeight - headerHeight) {
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
    if (Platform.OS === "web") {
      return {
        justifyContent: "center",
      };
    }
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
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerShown: false,
      });
    }
    opacity.value = withTiming(0);
  }, [navigation, opacity]);

  const showHeader = useCallback(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerShown: true,
      });
    }
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

  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";

  if (windowWidth >= 768) {
    return <FeedItemMD nft={nft} itemHeight={itemHeight} />;
  }

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View tw="w-full" style={{ height: itemHeight }}>
        {Platform.OS !== "web" && (
          <View>
            {nft.blurhash ? (
              <Blurhash
                blurhash={nft.blurhash}
                decodeWidth={16}
                decodeHeight={16}
                decodeAsync={true}
                style={tw.style("w-full h-full")}
              />
            ) : (
              <Image
                tw="h-full w-full "
                source={{
                  uri: getMediaUrl({ nft, stillPreview: true }),
                }}
              >
                <BlurView
                  tint={tint}
                  intensity={100}
                  style={tw.style("h-full w-full")}
                />
              </Image>
            )}
          </View>
        )}

        <FeedItemTapGesture toggleHeader={toggleHeader} showHeader={showHeader}>
          <Animated.View
            style={[
              {
                height: Platform.select({
                  web: itemHeight - detailHeight,
                  default: itemHeight - bottomPadding,
                }),
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
              resizeMode={Platform.select({
                web: "contain",
                default: "cover",
              })}
              onPinchStart={hideHeader}
              onPinchEnd={showHeader}
            />
          </Animated.View>
        </FeedItemTapGesture>

        <Reanimated.View
          style={[
            tw.style("z-1 absolute right-0 left-0"),
            detailStyle,
            { bottom: bottomMargin },
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
          <FeedMutedButton nft={nft} />

          <BlurView
            tint={tint}
            intensity={100}
            style={{
              // @ts-ignore
              ...blurredBackgroundStyles,
              ...tw.style(
                "bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-20"
              ),
              paddingBottom: bottomPadding,
            }}
          >
            <NFTDetails edition={edition} nft={nft} />
          </BlurView>
        </Reanimated.View>
      </View>
    </LikeContextProvider>
  );
});
FeedItem.displayName = "FeedItem";

const FeedMutedButton = ({ nft }: { nft: NFT }) => {
  const [muted, setMuted] = useMuted();

  if (Platform.OS !== "web" && nft?.mime_type?.startsWith("video")) {
    return (
      <View tw="z-9 absolute top-[-40px] right-4">
        <MuteButton
          onPress={() => {
            setMuted(!muted);
          }}
          muted={muted}
        />
      </View>
    );
  }

  return null;
};
