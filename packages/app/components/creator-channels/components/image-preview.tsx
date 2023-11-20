import { useMemo } from "react";

import Animated, { AnimatedRef, AnimatedStyle } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";

import { ChannelMessage } from "../types";
import { getImageAttachmentHeight, getImageAttachmentWidth } from "../utils";
import { LeanText, LeanView } from "./lean-text";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const ImagePreview = ({
  attachment,
  isViewable = false,
  animatedRef,
  style,
}: {
  attachment: ChannelMessage;
  isViewable?: boolean;
  animatedRef?: AnimatedRef<any>;
  style?: AnimatedStyle;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const fileObj = useMemo(
    () => attachment.attachments[0],
    [attachment.attachments]
  );
  const width = useMemo(
    () => getImageAttachmentWidth({ attachment: fileObj }),
    [fileObj]
  );
  const height = useMemo(
    () => getImageAttachmentHeight({ attachment: fileObj }),
    [fileObj]
  );

  return (
    <>
      <Pressable
        onPress={() => {
          router.push(
            `/viewer?tag=${attachment?.id}&url=${fileObj.url}&width=${width}&height=${height}`
          );
        }}
        disabled={!isViewable}
        style={{ display: isViewable ? undefined : "none" }}
      >
        <AnimatedImage
          ref={animatedRef}
          tw="web:cursor-pointer"
          transition={300}
          recyclingKey={attachment.attachments[0]?.media_upload}
          source={
            fileObj.url
              ? {
                  uri: fileObj.url + "?optimizer=image&width=300&quality=50",
                  width: 300,
                }
              : undefined
          }
          placeholderContentFit={"contain"}
          alt=""
          style={[
            { borderRadius: 8 },
            { backgroundColor: isDark ? "#333" : "#f5f5f5" },
            { display: isViewable ? undefined : "none" },
            { width },
            { height },
            style,
          ]}
          cachePolicy={"none"}
        />
      </Pressable>
      {!isViewable ? (
        <LeanView
          tw="items-center justify-center rounded-lg bg-gray-800 bg-opacity-90"
          style={{ width, height }}
        >
          <LeanText tw="text-center text-lg text-white dark:text-gray-300">
            Unlock to view
          </LeanText>
        </LeanView>
      ) : null}
    </>
  );
};

ImagePreview.displayName = "ImagePreview";
