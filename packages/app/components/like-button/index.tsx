import { SocialButton } from "app/components/social-button";
import { useSocialColor } from "app/hooks/use-social-color";
import { formatNumber } from "app/utilities";

import { Heart, HeartFilled } from "design-system/icon";
import { colors } from "design-system/tailwind";

export function LikeButton({
  onPress,
  isLiked,
  likeCount,
}: {
  onPress: () => void;
  isLiked?: boolean;
  likeCount: number;
}) {
  const { iconColor } = useSocialColor();
  return (
    <SocialButton
      text={likeCount > 0 ? ` ${formatNumber(likeCount)}` : ""}
      onPress={onPress}
    >
      {isLiked ? (
        <HeartFilled height={24} width={24} color={colors.red[500]} />
      ) : (
        <Heart height={24} width={24} color={iconColor} />
      )}
    </SocialButton>
  );
}
