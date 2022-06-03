import { Button } from "@showtime-xyz/universal.button";
import { Heart, HeartFilled } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";

import { getRoundedCount } from "app/utilities";

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
    <Button variant="text" size="regular" tw="h-auto p-0" onPress={onPress}>
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
      )}{" "}
      {likeCount > 0 ? getRoundedCount(likeCount) : ""}
    </Button>
  );
}
