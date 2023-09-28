import { useMemo, memo } from "react";
import { Platform, StyleSheet, Dimensions } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";

import { ChannelMessageAttachment } from "../types";
import { LeanView } from "./lean-text";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const getImageAttachmentWidth = (attachment: ChannelMessageAttachment) => {
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

const getImageAttachmentHeight = (attachment: ChannelMessageAttachment) => {
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
  ({ attachment }: { attachment: ChannelMessageAttachment }) => {
    const imageAttachmentWidth = useMemo(
      () => getImageAttachmentWidth(attachment),
      [attachment]
    );

    const imageAttachmentHeight = useMemo(
      () => getImageAttachmentHeight(attachment),
      [attachment]
    );
    const isLandscape =
      attachment.width && attachment.height
        ? attachment.width > attachment.height
        : false;

    const imageWidth = isLandscape
      ? Math.max(380, Math.min(width, height * 0.7))
      : Math.min(width, height * 0.7);

    const imageHeight =
      attachment.height && attachment?.width
        ? isLandscape
          ? imageWidth * (attachment.height / attachment.width)
          : Math.min(
              height,
              imageWidth * (attachment.height / attachment.width)
            )
        : 320;

    return (
      <LeanView
        tw="overflow-hidden rounded-xl bg-gray-600"
        style={{
          width: imageAttachmentWidth,
          height: imageAttachmentHeight,
        }}
      >
        <LightBox
          width={imageAttachmentWidth}
          height={imageAttachmentHeight}
          imgLayout={{
            width: "100%",
            height:
              Platform.OS === "web"
                ? imageAttachmentHeight
                : width *
                  (attachment.height && attachment?.width
                    ? attachment?.height / attachment.width
                    : 320),
          }}
          tapToClose
          borderRadius={12}
          containerStyle={
            Platform.OS === "web"
              ? {
                  width: imageWidth,
                  height: imageHeight,
                }
              : null
          }
        >
          <Image
            transition={100}
            recyclingKey={attachment?.media_upload}
            source={
              attachment?.url
                ? `${attachment?.url}?optimizer=image&width=600`
                : undefined
            }
            alt=""
            resizeMode="cover"
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />
        </LightBox>
      </LeanView>
    );
  }
);

ImagePreview.displayName = "ImagePreview";
