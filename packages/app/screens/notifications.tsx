import { Suspense } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View, Spinner } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
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
    </>
  );
});

export { NotificationsScreen };
