import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Settings } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

export const NotificationsSettingIcon = ({ size = 24 }) => {
  const router = useRouter();
  const isDark = useIsDarkMode();

  return (
    <PressableScale
      onPress={() => {
        router.push("/settings?tab=1");
      }}
      tw="h-8 w-8 items-center justify-center rounded-full"
    >
      <Settings width={size} height={size} color={isDark ? "#FFF" : "#000"} />
    </PressableScale>
  );
};
