import { ReactNode, useMemo } from "react";

import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CONTAINER_TW, IMAGE_TW, DEFAULT_AVATAR_PIC } from "./constants";

export type AvatarProps = {
  url?: string;
  size?: number;
  borderRadius?: number;
  tw?: TW;
  children?: ReactNode;
};

const getAvatarImageUrl = (imgUrl: string, size: number) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s" + size * 2;
  }
  return imgUrl;
};

// TODO: alt
export const Avatar = ({
  url,
  borderRadius = 0,
  size = 32,
  tw = "",
  children,
}: AvatarProps) => {
  const imageSource = useMemo(
    () => ({ uri: getAvatarImageUrl(url || DEFAULT_AVATAR_PIC, size) }),
    [url, size]
  );

  return (
    <View
      tw={[CONTAINER_TW, Array.isArray(tw) ? tw.join(" ") : tw]}
      style={{ height: size, width: size }}
    >
      <Image
        source={imageSource}
        width={size}
        height={size}
        borderRadius={borderRadius}
        resizeMode="contain"
        tw={IMAGE_TW}
        style={{ height: size, width: size, borderRadius: borderRadius }}
      />
      {children}
    </View>
  );
};
