import { Suspense } from "react";
import { useWindowDimensions } from "react-native";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";
import { useTrackPageViewed } from "app/lib/analytics";

import { breakpoints } from "design-system/theme";

const NotificationsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notifications" });
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return (
    <View tw="w-full max-w-screen-2xl flex-1 md:px-6">
      <ErrorBoundary>
        <Suspense
          fallback={
            <View tw="mt-10 items-center justify-center">
              <Spinner size="small" />
            </View>
          }
        >
          <Notifications useWindowScroll={isMdWidth} />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
});

export { NotificationsScreen };
