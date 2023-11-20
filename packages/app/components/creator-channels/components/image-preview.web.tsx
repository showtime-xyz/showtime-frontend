import { useMemo, useState } from "react";
import { Modal, useWindowDimensions } from "react-native";

import { motion, useMotionValue, LayoutGroup } from "framer-motion";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ChannelMessage } from "../types";
import { getImageAttachmentHeight, getImageAttachmentWidth } from "../utils";

export const ImagePreview = ({
  attachment,
  isViewable = true,
}: {
  attachment: ChannelMessage;
  isViewable?: boolean;
  index: number;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [loaded, setIsLoaded] = useState(false);
  const backdropOpacity = useMotionValue(1);
  const isDark = useIsDarkMode();

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
    <LayoutGroup>
      <View style={{ width, height }}>
        <motion.img
          src={`${fileObj.url}?optimizer=image&width=300&quality=50`}
          alt=""
          onClick={() => setOpen((current) => !current)}
          layoutId={attachment.id.toString()}
          style={{
            borderRadius: 8,
            width,
            height,
            display: isViewable ? "flex" : "none",
            cursor: "zoom-in",
            backgroundColor: isDark ? "#333" : "#f5f5f5",
          }}
          transition={{ type: "timing" }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setOpen(false)}
              transition={{ type: "timing" }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                position: "absolute",
                zIndex: -1,
                cursor: "zoom-out",
                opacity: backdropOpacity,
              }}
            />
            <motion.img
              src={`${fileObj.url}?optimizer=image&width=300&quality=50`}
              alt=""
              layoutId={attachment.id.toString()}
              style={{
                borderRadius: 0,
                width: modalWidth,
                height: modalHeight,
                display: loaded ? "none" : "flex",
              }}
              transition={{ type: "tween" }}
              draggable={false}
              drag
              dragSnapToOrigin
              dragElastic={1}
              dragMomentum={false}
              onDrag={(event, info) => {
                const parentHeight = dimensions.height || window.innerHeight;
                const percentDragged = Math.abs(info.offset.y / parentHeight);
                backdropOpacity.set(1 - percentDragged);
              }}
              onDragEnd={(event, info) => {
                const parentHeight = dimensions.height || window.innerHeight;
                const percentDragged = Math.abs(info.offset.y / parentHeight);
                console.log("drag", 1 - percentDragged);
                if (1 - percentDragged < 0.95 || info.velocity.y > 500) {
                  setOpen(false);
                } else {
                  backdropOpacity.set(1);
                }
              }}
            />
            <motion.img
              src={`${fileObj.url}?optimizer=image&width=1200`}
              alt=""
              style={{
                borderRadius: 0,
                width: modalWidth,
                height: modalHeight,
                opacity: 1,
                position: "absolute",
              }}
              layoutId={attachment.id.toString()}
              transition={{ type: "tween" }}
              draggable={false}
              drag
              dragSnapToOrigin
              dragElastic={1}
              dragMomentum={false}
              onDrag={(event, info) => {
                const parentHeight = dimensions.height || window.innerHeight;
                const percentDragged = Math.abs(info.offset.y / parentHeight);
                backdropOpacity.set(1 - percentDragged);
              }}
              onDragEnd={(event, info) => {
                const parentHeight = dimensions.height || window.innerHeight;
                const percentDragged = Math.abs(info.offset.y / parentHeight);
                console.log("drag", 1 - percentDragged);
                if (1 - percentDragged < 0.95 || info.velocity.y > 500) {
                  setOpen(false);
                } else {
                  backdropOpacity.set(1);
                }
              }}
              onLoad={() => setIsLoaded(true)}
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
      </View>
    </LayoutGroup>
  );
};

ImagePreview.displayName = "ImagePreview";
