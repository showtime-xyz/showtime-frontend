import { useCallback, useMemo, useState } from "react";

import * as Haptics from "expo-haptics";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { useMyInfo } from "app/hooks/api-hooks";
import { NFT } from "app/types";

import { Text, Pressable } from "design-system";
import { Heart, HeartFilled } from "design-system/icon";
import { tw } from "design-system/tailwind";

import { formatNumber } from "../../utilities";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

function Like({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(
    typeof nft.like_count === "number" ? nft.like_count : 0
  );

  return (
    <Pressable
      tw="flex-row items-center"
      hitSlop={hitSlop}
      onPress={useCallback(async () => {
        if (isLikedNft) {
          setLikeCount(likeCount - 1);
          const isSuccessfullyUnlike = await unlike(nft.nft_id);
          if (!isSuccessfullyUnlike) {
            setLikeCount(likeCount + 1);
          }
        } else {
          Haptics.selectionAsync();
          setLikeCount(likeCount + 1);
          const isSuccessfullyLiked = await like(nft.nft_id);
          if (!isSuccessfullyLiked) {
            setLikeCount(likeCount - 1);
          }
        }
      }, [isLikedNft, like, unlike, likeCount])}
    >
      {isLikedNft ? (
        // <Animated.View key="liked" exiting={ZoomOut} entering={ZoomIn}>
        <HeartFilled height={24} width={24} color={tw.color("red-500")} />
      ) : (
        // </Animated.View>
        // <Animated.View key="unliked" exiting={ZoomOut} entering={ZoomIn}>
        <Heart
          height={24}
          width={24}
          //@ts-ignore
          color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
        />
        // </Animated.View>
      )}

      <Text tw="text-xs text-gray-900 dark:text-white font-bold ml-1 ">
        {likeCount > 0 ? formatNumber(likeCount) : undefined}
      </Text>
    </Pressable>
  );
}

export { Like };
