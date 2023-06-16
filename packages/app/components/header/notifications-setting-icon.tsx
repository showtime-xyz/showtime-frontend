import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Settings } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

export const NotificationsSettingIcon = () => {
  const router = useRouter();
  const isDark = useIsDarkMode();

  return (
    <PressableScale
      onPress={() => {
        router.push("/settings?tab=3");
      }}
      tw="h-8 w-8 items-center justify-center rounded-full"
    >
      <Settings width={24} height={24} color={isDark ? "#FFF" : "#000"} />
    </PressableScale>
  );
};
