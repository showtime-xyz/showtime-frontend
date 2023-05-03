import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { CloseLarge } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { breakpoints } from "design-system/theme";

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
  const { width } = useWindowDimensions();
  const isLgWidth = width >= breakpoints["lg"];
  return (
    <View
      tw={[MODAL_HEADER_CONTAINER_TW, Array.isArray(tw) ? tw.join(" ") : tw]}
    >
      {StartContentComponent ? (
        <StartContentComponent />
      ) : (
        <Button
          variant="tertiary"
          size={isLgWidth ? "regular" : "small"}
          onPress={onClose}
          iconOnly
          hitSlop={10}
          tw="mr-2"
        >
          <CloseLarge />
        </Button>
      )}

      <Text
        tw={[MODAL_HEADER_TITLE_TW, "flex-1 text-base font-bold sm:text-lg"]}
      >
        {title}
      </Text>

      {EndContentComponent ? (
        <EndContentComponent />
      ) : (
        <View tw="ml-2 w-12" collapsable={true} />
      )}
    </View>
  );
}

export const ModalHeader = memo(ModalHeaderComponent);
