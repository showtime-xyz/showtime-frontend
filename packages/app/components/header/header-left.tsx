import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Showtime } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { ShowtimeBrandLogo } from "../showtime-brand";

type HeaderLeftProps = {
  canGoBack?: boolean;
  withBackground?: boolean;
  color?: string;
};
export const HeaderLeft = ({
  canGoBack,
  withBackground = false,
  color,
}: HeaderLeftProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const isHome = router.pathname === "/";
  const Icon = canGoBack || !isHome ? ArrowLeft : Showtime;

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      onPress={() => {
        if (isHome) {
          router.push("/");
        } else {
          router.back();
        }
      }}
    >
      {isHome ? (
        <ShowtimeBrandLogo color={isDark ? "#FFF" : "#000"} />
      ) : (
        <View
          tw="h-7 w-7 items-center justify-center rounded-full"
          style={withBackground && { backgroundColor: "rgba(0,0,0,.6)" }}
        >
          <Icon
            color={
              color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
            }
            width={24}
            height={24}
          />
        </View>
      )}
    </PressableScale>
  );
};
