import { useContext } from "react";
import { captureException } from "@sentry/nextjs";

import { AppContext } from "app/context/app-context";
import { axios } from "app/lib/axios";
import { accessTokenManager } from "app/lib/access-token-manager";
import { mixpanel } from "app/lib/mixpanel";
import { Heart, HeartFilled } from "design-system/icon";
import { View, Text, Pressable } from "design-system";
import { useRouter } from "app/navigation/use-router";

const LikeButton = ({ item }) => {
  const isAuthenticated = accessTokenManager.getAccessToken();
  const context = useContext(AppContext);
  const router = useRouter();

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);

    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        (context.myLikeCounts && !context.myLikeCounts[item?.nft_id]
          ? context.myLikeCounts[item?.nft_id]
          : item.like_count) + 1,
    });

    try {
      await axios({ url: `/v3/like/${nft_id}`, method: "POST" });
      mixpanel.track("Liked item");
    } catch (err) {
      if (err.response.data.code === 429) {
        // Change myLikes via setMyLikes
        context.setMyLikes(
          context.myLikes.filter((item) => !(item === nft_id))
        );

        context.setMyLikeCounts({
          ...context.myLikeCounts,
          [nft_id]:
            (context.myLikeCounts && !context.myLikeCounts[item?.nft_id]
              ? context.myLikeCounts[item?.nft_id]
              : item.like_count) - 0,
        });
        return context.setThrottleMessage(err.response.data.message);
      }

      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }

      //TODO: update this in notion
      captureException(err, {
        tags: {
          nft_like: "LikeButton.js",
        },
      });
    }
  };

  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));

    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        (context.myLikeCounts && !context.myLikeCounts[item?.nft_id]
          ? context.myLikeCounts[item?.nft_id]
          : item.like_count) - 1,
    });

    try {
      await axios({ url: `/v3/unlike/${nft_id}`, method: "POST" });
      mixpanel.track("Unliked item");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      //TODO: update this in notion
      captureException(error, {
        tags: {
          nft_unlike: "LikeButton.js",
        },
      });
    }
  };

  const like_count =
    context.myLikeCounts && !context.myLikeCounts[item?.nft_id]
      ? context.myLikeCounts[item?.nft_id]
      : item.like_count;
  const liked = context.myLikes?.includes(item.nft_id);

  const handleLoggedOutLike = () => {
    mixpanel.track("Liked but logged out");
    router.push("/login");
  };

  return (
    <Pressable
      tw="focus:outline-none hover:bg-red-50 dark:hover:bg-red-900 focus-visible:bg-red-50 dark:focus-visible:bg-red-900 px-2 -mx-2 rounded-xl group"
      disabled={context.disableLikes}
      onPress={() =>
        isAuthenticated
          ? liked
            ? handleUnlike(item.nft_id)
            : handleLike(item.nft_id)
          : handleLoggedOutLike()
      }
    >
      <View tw={`flex-row items-center rounded-md py-1`}>
        <View>
          {liked ? <HeartFilled tw="w-5 h-5" /> : <Heart tw="w-5 h-5" />}
        </View>
        <Text
          tw={`ml-1 whitespace-nowrap dark:text-gray-300 ${
            liked
              ? "text-red-500 dark:text-red-600"
              : "group-hover:text-red-400 dark:group-hover:text-red-400"
          } ${context.disableLikes ? "hover:text-gray-500 text-gray-500" : ""}`}
        >
          {Number(like_count < 0 ? 0 : like_count).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
};

export { LikeButton };
