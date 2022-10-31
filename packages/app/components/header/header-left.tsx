import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Search } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";

type HeaderLeftProps = {
  canGoBack: boolean;
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
  const canGoHome = router.pathname.split("/").length - 1 >= 2;
  const Icon = canGoBack || canGoHome ? ArrowLeft : Search;

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
        if (canGoBack) {
          router.pop();
        } else if (canGoHome) {
          router.push("/home");
        } else {
          router.push("/search");
        }
      }}
    >
      <Icon
        color={
          color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
        }
        width={24}
        height={24}
      />
    </PressableScale>
  );
};
