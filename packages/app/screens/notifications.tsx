import { Suspense } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";
import { useTrackPageViewed } from "app/lib/analytics";

import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

const NotificationsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notifications" });
  return (
    <View tw="w-full max-w-screen-2xl flex-1 bg-white dark:bg-black md:px-6">
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
  );
});

export { NotificationsScreen };
