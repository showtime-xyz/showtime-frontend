import { memo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close } from "@showtime-xyz/universal.icon";
import {
  PressableScale,
  PressableScaleProps,
} from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { TW, colors } from "@showtime-xyz/universal.tailwind";

type CloseButtonProps = PressableScaleProps & {
  color?: string;
  onPress?: () => void;
};
export const CloseButton = memo<CloseButtonProps>(function CloseButton({
  onPress,
  color,
  ...rest
}) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  return (
    <PressableScale
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          router.back();
        }
      }}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      {...rest}
    >
      <Close
        color={color ? color : isDark ? colors.gray[400] : colors.gray[600]}
        width={24}
        height={24}
      />
    </PressableScale>
  );
});
