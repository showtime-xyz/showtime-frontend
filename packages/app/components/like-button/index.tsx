import { Button } from "@showtime-xyz/universal.button";
import { Heart, HeartFilled } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useSocialColor } from "app/hooks/use-social-color";
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
  const { iconColor, textColors } = useSocialColor();
  return (
    <Button
      variant="text"
      size="regular"
      tw="h-auto p-0"
      onPress={onPress}
      accentColor={textColors}
    >
      {isLiked ? (
        <HeartFilled height={24} width={24} color={tw.color("red-500")} />
      ) : (
        <Heart height={24} width={24} color={iconColor} />
      )}{" "}
      {likeCount > 0 ? getRoundedCount(likeCount) : ""}
    </Button>
  );
}
