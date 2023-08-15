import { Platform } from "react-native";

import { Image, ImageProps } from "@showtime-xyz/universal.image";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";

import { getNFTSlug } from "app/hooks/use-share-nft";
import { StarDropBadgeType } from "app/types";

import { toast } from "design-system/toast";

type StarDropBadgeProps = Omit<
  ImageProps,
  "source" | "width" | "height" | "resizeMode"
> & {
  size?: number;
  data?: StarDropBadgeType;
  username?: string;
};
export const StarDropBadge = ({
  size = 18,
  data,
  username,
  ...rest
}: StarDropBadgeProps) => {
  const router = useRouter();
  if (!data) {
    return null;
  }
  return (
    <PressableHover
      onPress={() => {
        if (data?.slug && username) {
          router.push(`/@${username}/${data.slug}`);
        } else {
          toast("This user doesn't have a star drop yet.");
        }
      }}
    >
      <Image
        source={
          Platform.OS === "web"
            ? "https://media.showtime.xyz/assets/st-logo.png"
            : require("app/components/assets/st-logo.png")
        }
        width={size}
        height={size}
        {...rest}
      />
    </PressableHover>
  );
};
