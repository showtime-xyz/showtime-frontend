import { useMemo, memo } from "react";
import { useWindowDimensions } from "react-native";

import Animated, { AnimatedRef, AnimatedStyle } from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { ChannelMessageAttachment } from "../types";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const getImageAttachmentWidth = (
  attachment: ChannelMessageAttachment
) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }
  if (attachment?.height > attachment?.width) {
    return 160;
  } else if (attachment?.height < attachment?.width) {
    return 320;
  } else {
    return 320;
  }
};

export const getImageAttachmentHeight = (
  attachment: ChannelMessageAttachment
) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }
  if (attachment.height > attachment.width) {
    return 284;
  } else if (attachment.height < attachment.width) {
    return 180;
  } else {
    return 320;
  }
};

export const ImagePreview = memo(
  ({
    attachment,
    isViewable,
    animatedRef,
    style,
  }: {
    attachment: ChannelMessageAttachment;
    isViewable?: boolean;
    animatedRef?: AnimatedRef<any>;
    style: AnimatedStyle;
  }) => {
    const imageAttachmentWidth = useMemo(
      () => getImageAttachmentWidth(attachment),
      [attachment]
    );

    const imageAttachmentHeight = useMemo(
      () => getImageAttachmentHeight(attachment),
      [attachment]
    );

    return (
      <AnimatedImage
        ref={animatedRef}
        tw="web:cursor-pointer rounded-lg"
        transition={100}
        recyclingKey={attachment?.media_upload}
        width={imageAttachmentWidth}
        height={imageAttachmentHeight}
        source={{
          uri: attachment?.url
            ? `${attachment?.url}?optimizer=image&width=600`
            : undefined,
          width: 600,
        }}
        alt=""
        style={style}
      />
    );
  }
);

ImagePreview.displayName = "ImagePreview";
