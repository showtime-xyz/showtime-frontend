import { ReactNode, useMemo, forwardRef, useState, memo } from "react";
import { ViewStyle } from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image } from "@showtime-xyz/universal.image";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CONTAINER_TW, IMAGE_TW, DEFAULT_AVATAR_PIC } from "./constants";

export type AvatarProps = {
  url?: string;
  size?: number;
  borderRadius?: number;
  tw?: TW;
  children?: ReactNode;
  alt?: string;
  style?: ViewStyle;
  enableSkeleton?: boolean;
};

const getAvatarImageUrl = (imgUrl: string, size: number) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s" + size * 2;
  }
  return imgUrl;
};

const AvatarComponent = forwardRef<typeof View, AvatarProps>(
  function AvatarComponent(
    {
      url,
      borderRadius = 999,
      size = 32,
      tw = "",
      children,
      alt = "Avatar",
      style,
      enableSkeleton,
    },
    ref
  ) {
    const { colorScheme } = useColorScheme();
    const [isLoading, setIsLoading] = useState(enableSkeleton);
    const imageSource = useMemo(
      () => ({ uri: getAvatarImageUrl(url || DEFAULT_AVATAR_PIC, size) }),
      [url, size]
    );
    return (
      <Skeleton
        width={size}
        height={size}
        radius={borderRadius}
        show={isLoading}
        colorMode={colorScheme as any}
      >
        <View
          tw={[CONTAINER_TW, Array.isArray(tw) ? tw.join(" ") : tw]}
          style={{ height: size, width: size, ...style }}
          ref={ref}
        >
          <Image
            source={imageSource}
            width={size}
            height={size}
            borderRadius={borderRadius}
            resizeMode="cover"
            tw={IMAGE_TW}
            style={{ height: size, width: size, borderRadius: borderRadius }}
            alt={alt}
            {...(enableSkeleton
              ? {
                  onLoadEnd: () => setIsLoading(true),
                  onLoad: () => setIsLoading(false),
                }
              : {})}
          />
          {children}
        </View>
      </Skeleton>
    );
  }
);
export const Avatar = memo(AvatarComponent);
