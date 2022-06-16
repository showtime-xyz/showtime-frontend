import { Platform } from "react-native";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { Text } from "design-system/text";
import { View } from "design-system/view";

const NotificationsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notifications" });
  const headerHeight = useHeaderHeight();

  return (
    <View tw="w-full">
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
        <Text tw="font-space-bold text-2xl font-extrabold text-black dark:text-white">
          Notifications
        </Text>
        <View tw="h-6" />
        <Text tw="font-semibold text-gray-600 dark:text-gray-400">
          🚧 Coming soon
        </Text>
      </View>
    </View>
  );
});

export { NotificationsScreen };
