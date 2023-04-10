import { Heart, HeartFilled } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";

import { SocialButton } from "app/components/social-button";
import { useSocialColor } from "app/hooks/use-social-color";
import { formatNumber } from "app/utilities";

export function LikeButton({
  onPress,
  isLiked,
  likeCount,
  vertical,
}: {
  onPress: () => void;
  isLiked?: boolean;
  likeCount: number;
  vertical?: boolean;
}) {
  const { iconColor } = useSocialColor();
  return (
    <SocialButton
      text={
        likeCount > 0
          ? `${!vertical ? " " : ""}${formatNumber(likeCount)}`
          : vertical
          ? "0"
          : " " // this is a non-breaking space to prevent jumps
      }
      onPress={onPress}
      vertical={vertical}
    >
      {isLiked ? (
        <HeartFilled
          height={vertical ? 36 : 24}
          width={vertical ? 36 : 24}
          color={colors.red[500]}
        />
      ) : (
        <Heart
          height={vertical ? 36 : 24}
          width={vertical ? 36 : 24}
          color={iconColor}
        />
      )}
    </SocialButton>
  );
}
