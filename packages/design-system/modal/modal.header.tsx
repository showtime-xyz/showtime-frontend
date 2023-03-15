import { memo } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Close } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import type { ModalHeaderProps } from "./types";

const MODAL_HEADER_CONTAINER_TW = "p-4 flex-row items-center justify-between";
const MODAL_HEADER_TITLE_TW = "dark:text-white font-bold text-center";

function ModalHeaderComponent({
  title,
  endContentComponent: EndContentComponent,
  startContentComponent: StartContentComponent,
  tw = "",
  onClose,
}: ModalHeaderProps) {
  const iconSize = Platform.OS === "web" ? 24 : 20;
  return (
    <View
      tw={[MODAL_HEADER_CONTAINER_TW, Array.isArray(tw) ? tw.join(" ") : tw]}
    >
      {StartContentComponent ? (
        <StartContentComponent />
      ) : (
        <Button
          variant="tertiary"
          size="regular"
          onPress={onClose}
          iconOnly
          hitSlop={10}
          tw="ios:h-8 ios:w-8 android:h-8 android:w-8"
        >
          <Close width={iconSize} height={iconSize} />
        </Button>
      )}

      <Text
        tw={[
          MODAL_HEADER_TITLE_TW,
          "ios:pl-8 android:pl-8 max-w-[90%] text-base font-bold",
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {EndContentComponent ? (
        <EndContentComponent />
      ) : (
        <View tw="w-12" collapsable={true} />
      )}
    </View>
  );
}

export const ModalHeader = memo(ModalHeaderComponent);
