import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Settings } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

export const NotificationsSettingIcon = ({ size = 24 }) => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const tabIndex = Platform.OS === "web" ? 2 : 1;
  return (
    <PressableScale
      onPress={() => {
        router.push(`/settings?tab=${tabIndex}`);
      }}
      tw="h-8 w-8 items-center justify-center rounded-full"
    >
      <Settings width={size} height={size} color={isDark ? "#FFF" : "#000"} />
    </PressableScale>
  );
};
