import { memo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { CloseLarge } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import type { ModalHeaderProps } from "./types";

const MODAL_HEADER_CONTAINER_TW = "p-4 flex-row items-center justify-between";
const MODAL_HEADER_TITLE_TW = "dark:text-white font-bold text-center";

function ModalHeaderComponent({
  title,
  subtitle,
  endContentComponent: EndContentComponent,
  startContentComponent: StartContentComponent,
  tw = "",
  onClose,
  closeButtonProps,
}: ModalHeaderProps) {
  return (
    <View
      tw={[MODAL_HEADER_CONTAINER_TW, Array.isArray(tw) ? tw.join(" ") : tw]}
    >
      {StartContentComponent ? (
        <StartContentComponent />
      ) : (
        <Button
          variant="tertiary"
          size="small"
          onPress={onClose}
          iconOnly
          hitSlop={10}
          {...closeButtonProps}
        >
          <CloseLarge />
        </Button>
      )}

      <View tw="ml-5 flex-1 items-center justify-center">
        <Text tw={[MODAL_HEADER_TITLE_TW, "text-base font-bold"]}>{title}</Text>
        {subtitle && <Text tw="pt-3 text-sm">{subtitle}</Text>}
      </View>

      {EndContentComponent ? (
        <EndContentComponent />
      ) : (
        <View tw="ml-2 w-12" collapsable={true} />
      )}
    </View>
  );
}

export const ModalHeader = memo(ModalHeaderComponent);
