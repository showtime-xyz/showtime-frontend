import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Search, Showtime } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

type HeaderLeftProps = {
  withBackground?: boolean;
  color?: string;
};
export const HeaderSearch = ({
  withBackground = false,
  color,
}: HeaderLeftProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const navigateToLogin = useNavigateToLogin();

  const canGoHome = router.pathname.split("/").length - 1 >= 2;
  if (!isAuthenticated) {
    return <Button onPress={navigateToLogin}>Sign In</Button>;
  }

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        {
          height: 32,
          width: 32,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 999,
        },
        withBackground && { backgroundColor: "rgba(0,0,0,.6)" },
      ]}
      onPress={() => {
        if (canGoHome) {
          router.back();
        } else {
          router.push("/search");
        }
      }}
    >
      <Search
        color={
          color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
        }
        width={20}
        height={20}
      />
    </PressableScale>
  );
};
