import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { SWIPE_LIST_SCREENS } from "app/lib/constants";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { withColorScheme } from "../memo-with-theme";
import { HeaderLeft } from "./header-left";
import { HeaderRight } from "./header-right";

export const HeaderSm = withColorScheme(
  ({ canGoBack }: { canGoBack: boolean }) => {
    const { isHeaderHidden } = useNavigationElements();
    const router = useRouter();
    const { isAuthenticated } = useUser();

    if (isHeaderHidden) {
      return null;
    }
    return (
      <>
        <View tw={["fixed left-4 top-2 z-10 flex md:hidden"]}>
          <HeaderLeft withBackground canGoBack={canGoBack} />
        </View>
        {(!SWIPE_LIST_SCREENS.includes(router.pathname) ||
          !isAuthenticated) && (
          <View tw={["fixed right-4 top-2 z-10 flex md:hidden"]}>
            <HeaderRight withBackground />
          </View>
        )}
      </>
    );
  }
);
