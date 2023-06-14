import { Suspense } from "react";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";
import { useTrackPageViewed } from "app/lib/analytics";

const NotificationsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notifications" });
  return (
    <View tw="w-full flex-1 bg-white dark:bg-black">
      <View tw="max-w-screen-content mx-auto w-full flex-1 bg-white dark:bg-black md:px-6">
        <ErrorBoundary>
          <Suspense
            fallback={
              <View tw="mt-10 items-center justify-center">
                <Spinner size="small" />
              </View>
            }
          >
            <Notifications />
          </Suspense>
        </ErrorBoundary>
      </View>
    </View>
  );
});

export { NotificationsScreen };
