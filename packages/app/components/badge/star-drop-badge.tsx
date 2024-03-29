import { Platform } from "react-native";

import { Image, ImageProps } from "@showtime-xyz/universal.image";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";

import { StarDropBadgeType } from "app/types";

type StarDropBadgeProps = Omit<
  ImageProps,
  "source" | "width" | "height" | "resizeMode"
> & {
  size?: number;
  data?: StarDropBadgeType;
  tw?: string;
};
export const StarDropBadge = ({
  size = 18,
  data,
  tw,
  ...rest
}: StarDropBadgeProps) => {
  const router = useRouter();
  if (!data) {
    return null;
  }
  return (
    <PressableHover
      onPress={() => {
        if (data?.slug && data?.username) {
          router.push(`/@${data?.username}/${data.slug}`);
        }
      }}
      tw={tw}
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
