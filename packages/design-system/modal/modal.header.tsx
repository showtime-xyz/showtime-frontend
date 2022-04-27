import { memo, useMemo } from "react";

import { Button } from "design-system/button";
import { Close } from "design-system/icon";
import { tw as tailwind } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

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
      <Button variant="tertiary" size="small" onPress={onClose} iconOnly>
        <Close />
      </Button>

      <Text variant="text-lg" tw={MODAL_HEADER_TITLE_TW}>
        {title}
      </Text>

      {EndContentComponent ? (
        <EndContentComponent />
      ) : (
        <View tw="w-8" collapsable={true} />
      )}
    </View>
  );
}

export const ModalHeader = memo(ModalHeaderComponent);
