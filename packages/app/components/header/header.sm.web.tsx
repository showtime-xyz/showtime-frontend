import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import {
  HIDE_MOBILE_WEB_HEADER_SCREENS,
  SWIPE_LIST_SCREENS,
} from "app/lib/constants";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { withColorScheme } from "../memo-with-theme";
import HeaderCenter from "./header-center";
import { HeaderLeft } from "./header-left";
import { HeaderRightSm } from "./header-right.sm";
import { HeaderTitle } from "./header-title";

export const HeaderSm = withColorScheme(
  ({ canGoBack }: { canGoBack: boolean }) => {
    const { isHeaderHidden } = useNavigationElements();
    const router = useRouter();

    if (isHeaderHidden) {
      return null;
    }
    if (HIDE_MOBILE_WEB_HEADER_SCREENS.includes(router.pathname)) {
      return null;
    }
    if (SWIPE_LIST_SCREENS.includes(router.pathname)) {
      return (
        <>
          <View tw={["fixed left-4 top-2 z-10 flex md:hidden"]}>
            <HeaderLeft withBackground canGoBack={canGoBack} />
          </View>
        </>
      );
    }

    if (router.pathname === "/profile/[username]") {
      return (
        <>
          <View tw={["fixed left-4 top-2 z-10 flex md:hidden"]}>
            <HeaderLeft withBackground canGoBack={canGoBack} />
          </View>
          <View tw={["fixed right-4 top-2 z-10 flex md:hidden"]}>
            <HeaderRightSm withBackground />
          </View>
        </>
      );
    }

    return (
      <>
        <View
          tw={[
            "fixed top-0 z-10 flex w-full flex-row justify-between bg-white/80 px-4 py-2 backdrop-blur-md dark:bg-black/70 md:hidden",
          ]}
        >
          <HeaderLeft canGoBack={canGoBack} />
          <HeaderTitle />
          <HeaderRightSm />
        </View>
      </>
    );
  }
);
