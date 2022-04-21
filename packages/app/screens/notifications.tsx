import { Suspense } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View, Text, Spinner } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
      {/* <ErrorBoundary>
        <Suspense
          fallback={
            <View tw="mt-10 items-center justify-center">
              <Spinner size="small" />
            </View>
          }
        >
          <Notifications />
        </Suspense>
      </ErrorBoundary> */}
      <View tw="p-4">
        <Text variant="text-2xl" tw="font-extrabold text-black dark:text-white">
          Notifications
        </Text>
        <View tw="h-6" />
        <Text tw="font-semibold text-gray-600 dark:text-gray-400">
          🚧 Coming soon
        </Text>
      </View>
    </>
  );
});

export { NotificationsScreen };
