import { memo, useMemo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Close } from "@showtime-xyz/universal.icon";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import type { ModalHeaderProps } from "./types";

const MODAL_HEADER_CONTAINER_TW = "p-4 flex-row items-center justify-between";
const MODAL_HEADER_TITLE_TW = "dark:text-white font-bold text-center";

function ModalHeaderComponent({
  title,
  endContentComponent: EndContentComponent,
  tw,
  onClose,
}: ModalHeaderProps) {
  const containerStyle = useMemo(
    () =>
      tailwind.style(
        MODAL_HEADER_CONTAINER_TW,
        ...(typeof tw === "undefined"
          ? [""]
          : typeof tw === "string"
          ? [tw]
          : tw)
      ),
    [tw]
  );
  return (
    <View style={containerStyle}>
      <Button variant="tertiary" size="regular" onPress={onClose} iconOnly>
        <Close width={20} height={24} />
      </Button>

      <Text tw={[MODAL_HEADER_TITLE_TW, "font-space-bold text-lg"]}>
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
