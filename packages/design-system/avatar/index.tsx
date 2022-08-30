import { ReactNode, useMemo } from "react";

import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CONTAINER_TW, IMAGE_TW, DEFAULT_AVATAR_PIC } from "./constants";

export type AvatarProps = {
  url?: string;
  size?: number;
  borderWidth?: number;
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
  borderWidth = 0,
  size = 32,
  tw = "",
  children,
}: AvatarProps) => {
  const imageSource = useMemo(
    () => ({ uri: getAvatarImageUrl(url || DEFAULT_AVATAR_PIC, size) }),
    [url, size]
  );

  const containerTW = useMemo(
    () => [...(typeof tw === "string" ? [tw] : tw), CONTAINER_TW],
    [tw]
  );
  const imageTW = useMemo(
    () => [IMAGE_TW, borderWidth > 0 ? `border-${borderWidth}` : ""],
    [borderWidth]
  );

  return (
    <View tw={containerTW} style={{ height: size, width: size }}>
      <Image
        source={imageSource}
        width={size}
        height={size}
        resizeMode="contain"
        tw={imageTW}
        style={{ height: size, width: size }}
      />
      {children}
    </View>
  );
};
