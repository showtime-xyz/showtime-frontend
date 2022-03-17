import { ReactNode, useMemo } from "react";

import { Image } from "../image";
import { TW } from "../tailwind/types";
import { View } from "../view";
import { CONTAINER_TW, IMAGE_TW, DEFAULT_AVATAR_PIC } from "./constants";

export type AvatarProps = {
  url?: string;
  size?: number;
  borderWidth?: number;
  tw?: TW;
  children?: ReactNode;
};

const getAvatarImageUrl = (imgUrl?: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

export const Avatar = ({
  url,
  borderWidth = 0,
  size = 32,
  tw = "",
  children,
}: AvatarProps) => {
  const imageSource = useMemo(
    () => ({ uri: getAvatarImageUrl(url || DEFAULT_AVATAR_PIC) }),
    [url]
  );

  const containerTW = useMemo(
    () => [
      ...(typeof tw === "string" ? [tw] : tw),
      `w-[${size}px] h-[${size}px]`,
      CONTAINER_TW,
    ],
    [size]
  );
  const imageTW = useMemo(
    () => [
      IMAGE_TW,
      `w-[${size}px] h-[${size}px]`,
      borderWidth > 0 ? `border-${borderWidth}` : "",
    ],
    [size, borderWidth]
  );

  return (
    <View tw={containerTW}>
      <Image
        source={imageSource}
        width={size}
        height={size}
        resizeMode="contain"
        tw={imageTW}
      />
      {children}
    </View>
  );
};
