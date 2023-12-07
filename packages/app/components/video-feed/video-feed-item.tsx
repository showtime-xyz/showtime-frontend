import { useState, memo, useMemo, useContext } from "react";
import { StyleSheet, Platform, useWindowDimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import { Avatar } from "@showtime-xyz/universal.avatar";
import {
  ChannelLocked,
  ChannelUnlocked,
  Muted,
  Share,
  Unmuted,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { useCreatorTokenPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price-to-buy-next";
import { useShare } from "app/hooks/use-share";
import { useLogInPromise } from "app/lib/login-promise";
import { Link } from "app/navigation/link";
import { useMuted } from "app/providers/mute-provider";
import { VideoPost } from "app/types";
import { getVideoUrl, getWebBaseURL } from "app/utilities";

import { CollapsibleText } from "design-system/collapsible-text/collapsible-text";

import { LeanText } from "../creator-channels/components/lean-text";
import { PlatformBuyButton } from "../profile/buy-and-sell-buttons";
import { FeedVideo } from "./video-feed-video";

export const VideoFeedItem = memo(function VideoFeedItem({
  post,
  videoDimensions,
}: {
  post: VideoPost;
  videoDimensions: { height: any; width: any };
}) {
  const mediaURI = useMemo(
    () => getVideoUrl(post.media.urls),
    [post.media.urls]
  );
  const router = useRouter();
  const { share } = useShare();
  const { loginPromise } = useLogInPromise();

  return (
    <View tw="w-full items-center md:py-10">
      <View
        tw="bg-black md:overflow-hidden md:rounded-xl"
        style={{
          width: videoDimensions.width,
        }}
      >
        {mediaURI ? (
          <FeedVideo
            uri={mediaURI}
            height={videoDimensions.height}
            width={videoDimensions.width}
            aspectRatio={
              post.media.width && post.media.height
                ? post.media.width / post.media.height
                : 9 / 16
            }
          />
        ) : null}

        <View tw="z-1 absolute bottom-0 w-full">
          <LinearGradient
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            start={[1, 0]}
            end={[1, 1]}
            locations={[0.05, 0.8]}
            colors={["rgba(12,12,12,0)", "rgba(12,12,12,.8)"]}
          />
          <View tw="flex-1 flex-row items-center justify-between px-4 pb-8 pt-4">
            <View style={{ rowGap: 12, flex: 3 }}>
              <View tw="flex-row items-center">
                <Link
                  tw="flex-row items-center"
                  href={`/@${post.profile.username}`}
                >
                  <Avatar size={32} url={post.profile.img_url} />
                  <Text tw="ml-2 mr-4 font-semibold text-white">
                    {post.profile.username}
                  </Text>
                </Link>
                {post.creator_token_address ? (
                  <BuyButton
                    creatorTokenAddress={post.creator_token_address}
                    username={post.profile.username}
                  />
                ) : null}
              </View>
              <CollapsibleText tw="text-white" initialNumberOfLines={1}>
                {post.description}
              </CollapsibleText>
            </View>
            <View tw="flex-1 items-end" style={{ rowGap: 16 }}>
              <MuteButton />
              <Pressable
                tw="items-center"
                style={{ rowGap: 4 }}
                onPress={async () => {
                  await loginPromise();
                  router.push(`/channels/${post.creator_channel_id}`);
                }}
              >
                {post.viewer_is_in_creator_channel ? (
                  <ChannelUnlocked width={31} height={28} />
                ) : (
                  <ChannelLocked color="white" width={31} height={28} />
                )}
                <Text tw="text-white">{post.channel_message_count}</Text>
              </Pressable>
              <Pressable
                tw="items-center"
                onPress={() => {
                  share({ url: `${getWebBaseURL()}/posts/${post.id}` });
                }}
              >
                <Share color="white" width={28} height={28} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const MuteButton = () => {
  const [muted, setMuted] = useMuted();
  if (Platform.OS !== "web") return null;
  return (
    <Pressable onPress={() => setMuted(!muted)}>
      {muted ? (
        <Muted color="white" width={28} height={28} />
      ) : (
        <Unmuted color="white" width={28} height={28} />
      )}
    </Pressable>
  );
};

const BuyButton = (props: {
  creatorTokenAddress: string;
  username: string;
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const id = useContext(ItemKeyContext);
  const isItemInList = typeof id !== "undefined";

  const price = useCreatorTokenPriceToBuyNext({
    address: shouldFetch ? props.creatorTokenAddress : undefined,
    tokenAmount: 1,
  });

  const context = useContext(ViewabilityItemsContext);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (ctx.includes(id)) {
        runOnJS(setShouldFetch)(true);
      } else {
        runOnJS(setShouldFetch)(false);
      }
    },
    [id, isItemInList, context]
  );

  return (
    <PlatformBuyButton
      username={props.username}
      text={
        <LeanText tw="text-center text-sm font-semibold">
          Buy ${price.data?.displayPrice}
        </LeanText>
      }
      side="top"
      tw="rounded-4xl max-w-[150px] items-center justify-center px-4"
    />
  );
};
