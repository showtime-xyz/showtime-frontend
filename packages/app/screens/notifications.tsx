import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

import { View, Text } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notifications" });

  return (
    <View tw="p-4">
      <Text variant="text-2xl" tw="font-extrabold text-black dark:text-white">
        Notifications
      </Text>
      <View tw="h-6" />
      <Text tw="font-semibold text-gray-600 dark:text-gray-400">
        🚧 Coming soon
      </Text>
    </View>
  );
});

export { NotificationsScreen };
