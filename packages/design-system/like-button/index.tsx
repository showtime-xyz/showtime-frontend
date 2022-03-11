import { formatNumber } from "app/utilities";

import { Heart, HeartFilled } from "design-system/icon";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

export function LikeButton({
  onPress,
  isLiked,
  likeCount,
}: {
  onPress: () => void;
  isLiked?: boolean;
  likeCount: number;
}) {
  return (
    <Pressable tw="flex-row items-center" hitSlop={hitSlop} onPress={onPress}>
      {isLiked ? (
        // <Animated.View key="liked" exiting={ZoomOut} entering={ZoomIn}>
        <HeartFilled height={24} width={24} color={tw.color("red-500")} />
      ) : (
        // </Animated.View>
        // <Animated.View key="unliked" exiting={ZoomOut} entering={ZoomIn}>
        <Heart
          height={24}
          width={24}
          // @ts-ignore
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
