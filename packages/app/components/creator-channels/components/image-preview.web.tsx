import { useMemo } from "react";

import Animated, { AnimatedRef, AnimatedStyle } from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";

import { ChannelMessage, ChannelMessageAttachment } from "../types";
import { LeanText, LeanView } from "./lean-text";

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

export const ImagePreview = ({
  attachment,
  isViewable = false,
  animatedRef,
  style,
}: {
  attachment: ChannelMessage;
  isViewable?: boolean;
  animatedRef?: AnimatedRef<any>;
  style: AnimatedStyle;
}) => {
  const router = useRouter();
  const fileObj = useMemo(
    () => attachment.attachments[0],
    [attachment.attachments]
  );
  const width = useMemo(() => getImageAttachmentWidth(fileObj), [fileObj]);
  const height = useMemo(() => getImageAttachmentHeight(fileObj), [fileObj]);

  return (
    <>
      <Pressable
        onPress={() => {
          router.push(
            `/viewer?tag=${attachment?.id}&url=${fileObj.url}&width=${width}&height=${height}`
          );
        }}
        disabled={!isViewable}
      >
        <AnimatedImage
          ref={animatedRef}
          tw="web:cursor-pointer"
          transition={100}
          recyclingKey={attachment.attachments[0]?.media_upload}
          width={width}
          height={height}
          source={{
            uri: fileObj.url
              ? `${fileObj.url}?optimizer=image&width=300&quality=50`
              : undefined,
            width: 600,
          }}
          alt=""
          style={[
            { borderRadius: 8 },
            { display: isViewable ? undefined : "none" },
            style,
          ]}
        />
      </Pressable>
      {isViewable ? null : (
        <LeanView
          tw="items-center justify-center rounded-lg bg-gray-800 bg-opacity-90"
          style={{ width, height }}
        >
          <LeanText tw="text-center text-lg text-white dark:text-gray-300">
            Unlock to view
          </LeanText>
        </LeanView>
      )}
    </>
  );
};

ImagePreview.displayName = "ImagePreview";
