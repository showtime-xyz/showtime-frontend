import { memo } from "react";

import { View } from "../view";
import { WEB_HEIGHT } from "./constants";
import { ModalBackdrop } from "./modal.backdrop";
import { ModalHeader } from "./modal.header";
import type { ModalContainerProps } from "./types";

function ModalContainerComponent({
  title,
  web_height = WEB_HEIGHT,
  onClose,
  children,
}: ModalContainerProps) {
  return (
    <View
      tw={[
        "absolute top-0 right-0 bottom-0 left-0",
        "flex items-center justify-end sm:justify-center",
        "z-[999]",
      ]}
    >
      <ModalBackdrop onClose={onClose} />
      <View
        tw={[
          "flex overflow-hidden justify-center",
          "w-full	sm:w-420px",
          web_height,
          "bg-white dark:bg-black",
          "shadow-xl shadow-black dark:shadow-white",
          "rounded-t-[32px] rounded-b-0 sm:rounded-b-[32px]",
        ]}
      >
        <ModalHeader title={title} onClose={onClose} />
        <View tw={["flex-1 overflow-scroll"]}>{children}</View>
      </View>
    </View>
  );
}

export const ModalContainer = memo(ModalContainerComponent);
