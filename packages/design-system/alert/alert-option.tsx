import { memo } from "react";
import { AlertButton } from "react-native";

import { Button } from "design-system/button";
import type { ButtonVariant } from "design-system/button";

type AlertBtnType = AlertButton & {
  hide: () => void;
};

// get Alert btn preset style type.
const getAlertBtnVariant = (style: AlertButton["style"]) => {
  const variantMap = new Map<AlertButton["style"], ButtonVariant>([
    ["cancel", "text"],
    ["default", "primary"],
    ["destructive", "danger"],
  ]);
  return variantMap.get(style) ?? "primary";
};

export const AlertOption = memo<AlertBtnType>(function AlertBtn({
  onPress,
  text,
  style,
  hide,
}) {
  return (
    <Button
      variant={getAlertBtnVariant(style)}
      size="regular"
      onPress={() => {
        onPress?.(text);
        hide();
      }}
    >
      {text ?? "OK"}
    </Button>
  );
});
