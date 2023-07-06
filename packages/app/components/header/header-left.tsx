import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Showtime } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";

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
  const { isAuthenticated } = useUser();
  const isDark = useIsDarkMode();
  const router = useRouter();

  const canGoHome = router.pathname.split("/").length - 1 >= 2;

  const isHome = router.pathname === "/";
  const Icon = canGoBack || canGoHome ? ArrowLeft : Showtime;

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 999,
        },
        withBackground && { backgroundColor: "rgba(0,0,0,.6)" },
      ]}
      onPress={() => {
        if (canGoHome) {
          router.push("/");
        } else {
          router.back();
        }
      }}
    >
      {isHome || !isAuthenticated ? (
        <ShowtimeBrandLogo
          color={
            color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
          }
        />
      ) : (
        <Icon
          color={
            color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
          }
          width={24}
          height={24}
        />
      )}
    </PressableScale>
  );
};
