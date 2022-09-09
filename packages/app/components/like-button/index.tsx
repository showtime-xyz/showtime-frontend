import { Button } from "@showtime-xyz/universal.button";
import { Heart, HeartFilled } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";

import { useSocialColor } from "app/hooks/use-social-color";
import { formatNumber } from "app/utilities";

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
      tw="h-6 p-0 md:p-4"
      onPress={onPress}
      accentColor={textColors}
    >
      {isLiked ? (
        <HeartFilled height={24} width={24} color={colors.red[500]} />
      ) : (
        <Heart height={24} width={24} color={iconColor} />
      )}
      {likeCount > 0 ? ` ${formatNumber(likeCount)}` : ""}
    </Button>
  );
}
