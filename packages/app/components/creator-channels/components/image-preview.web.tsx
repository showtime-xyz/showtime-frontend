import { useMemo, useState, useRef } from "react";
import { Modal, useWindowDimensions, ScaledSize } from "react-native";

import { motion, useDomEvent } from "framer-motion";

import { Close } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ChannelMessage, ChannelMessageAttachment } from "../types";

type SizeProps = {
  attachment: ChannelMessageAttachment;
  dimensions?: ScaledSize;
};
export const getImageAttachmentWidth = ({
  attachment,
  dimensions,
}: SizeProps) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }

  const aspectRatio = attachment.width / attachment.height;
  const maxWidth = !dimensions ? 320 : dimensions.width;
  const maxHeight = !dimensions ? 284 : dimensions.height - 150;

  // Determine which dimension is the limiting factor (width or height)
  if (maxWidth / aspectRatio <= maxHeight) {
    // Width is the limiting factor
    return maxWidth;
  } else {
    // Height is the limiting factor
    return Math.round(maxHeight * aspectRatio);
  }
};

export const getImageAttachmentHeight = ({
  attachment,
  dimensions,
}: SizeProps) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }

  const aspectRatio = attachment.width / attachment.height;
  const maxWidth = !dimensions ? 320 : dimensions.width;
  const maxHeight = !dimensions ? 284 : dimensions.height - 150;

  // Determine which dimension is the limiting factor (width or height)
  if (maxHeight * aspectRatio <= maxWidth) {
    // Height is the limiting factor
    return maxHeight;
  } else {
    // Width is the limiting factor
    return Math.round(maxWidth / aspectRatio);
  }
};

const transition = {
  type: "spring",
  damping: 50,
  stiffness: 450,
};

export const ImagePreview = ({
  attachment,
  isViewable = true,
}: {
  attachment: ChannelMessage;
  isViewable?: boolean;
}) => {
  const [isOpen, setOpen] = useState(false);

  useDomEvent(
    useRef(document.documentElement),
    "scroll",
    () => isOpen && setOpen(false)
  );

  const fileObj = useMemo(
    () => attachment.attachments[0],
    [attachment.attachments]
  );
  const dimensions = useWindowDimensions();
  const width = useMemo(
    () => getImageAttachmentWidth({ attachment: fileObj }),
    [fileObj]
  );
  const height = useMemo(
    () => getImageAttachmentHeight({ attachment: fileObj }),
    [fileObj]
  );

  const modalWidth = useMemo(
    () => getImageAttachmentWidth({ attachment: fileObj, dimensions }),
    [fileObj, dimensions]
  );
  const modalHeight = useMemo(
    () => getImageAttachmentHeight({ attachment: fileObj, dimensions }),
    [fileObj, dimensions]
  );

  return (
    <>
      <motion.img
        src={`${fileObj.url}?optimizer=image&width=300&quality=50`}
        alt=""
        onClick={() => setOpen((current) => !current)}
        layoutId={attachment.id.toString()}
        style={{
          borderRadius: 8,
          position: "relative",
          width,
          height,
          display: isViewable ? "flex" : "none",
          cursor: "zoom-in",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        width={width}
        height={height}
        transition={transition}
        draggable={false}
      />

      <Modal
        transparent
        visible={isOpen}
        animationType="none"
        onRequestClose={() => setOpen((current) => !current)}
      >
        <View tw="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
          <View
            tw="absolute left-5 top-5 cursor-pointer"
            onPointerUp={() => setOpen(false)}
          >
            <Close color="white" width={30} height={30} />
          </View>
          <motion.div
            animate={{ opacity: isOpen ? 0.95 : 0 }}
            onClick={() => setOpen(false)}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              position: "absolute",
              opacity: 0,
              zIndex: -1,
              cursor: "zoom-out",
            }}
            layoutId="overlay"
          />
          <motion.img
            src={`${fileObj.url}?optimizer=image&width=1200`}
            alt=""
            onClick={() => setOpen((current) => !current)}
            layoutId={attachment.id.toString()}
            style={{
              borderRadius: 0,
              width: modalWidth,
              height: modalHeight,
              cursor: "zoom-out",
              willChange: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            placeholder={`${fileObj.url}?optimizer=image&width=300&quality=50`}
            transition={transition}
            draggable={false}
          />
        </View>
      </Modal>
      {isViewable ? null : (
        <View
          tw="items-center justify-center rounded-lg bg-gray-800 bg-opacity-90"
          style={{ width, height }}
        >
          <Text tw="text-center text-lg text-white dark:text-gray-300">
            Unlock to view
          </Text>
        </View>
      )}
    </>
  );
};

ImagePreview.displayName = "ImagePreview";
