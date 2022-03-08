import { getRoundedCount } from "app/utilities";

import { TextButton } from "design-system/button";
import { Heart, HeartFilled } from "design-system/icon";
import { tw } from "design-system/tailwind";

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
    <TextButton size="regular" tw="p-0 h-auto" onPress={onPress}>
      {isLiked ? (
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
      )}{" "}
      {likeCount > 0 ? getRoundedCount(likeCount) : ""}
    </TextButton>
  );
}
