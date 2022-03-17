import { useMemo } from "react";
import { View } from "../view";
import { Image } from "../image";
import { Avatar, AvatarProps } from ".";
import {
  CONTAINER_TW,
  MASKED_CONTAINER_TW,
  TOKEN_BORDER_TW,
  TOKEN_IMAGE_TW,
} from "./constants";

type AvatarWithTokenProps = AvatarProps;

const TokenImage = require("../../../apps/expo/assets/social_token.png");

export const AvatarWithToken = ({
  borderWidth = 8,
  size = 128,
  ...avatarProps
}: AvatarWithTokenProps) => {
  const containerTW = useMemo(
    () => [`w-[${size}px] h-[${size}px]`, CONTAINER_TW, MASKED_CONTAINER_TW],
    [size]
  );

  //TOKEN_BORDER_TW
  const tokenBorderTW = useMemo(
    () => [
      ...TOKEN_BORDER_TW,
      "bottom-[4px] right-[4px]",
      "w-[38px] h-[38px]",
      "bg-white dark:bg-black",
    ],
    [borderWidth]
  );
  const tokenImageTW = useMemo(
    () => [
      ...TOKEN_IMAGE_TW,
      "bottom-[6px] right-[6px]",
      "w-[32px] h-[32px]",
      "bg-white dark:bg-black",
    ],
    []
  );

  return (
    <Avatar borderWidth={borderWidth} size={size} {...avatarProps}>
      <View tw={containerTW}>
        <View tw={tokenBorderTW} />
      </View>
      <Image source={TokenImage} width={32} height={32} tw={tokenImageTW} />
    </Avatar>
  );
};
