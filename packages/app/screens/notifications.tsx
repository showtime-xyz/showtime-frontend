import { Suspense } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";

import { View, Text, Spinner } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  return (
    <View tw="p-4">
      <Text variant="text-2xl" tw="font-extrabold text-black dark:text-white">
        Notifications
      </Text>
      <View tw="h-6" />
      <Text tw="font-semibold text-gray-600 dark:text-gray-400">
        🚧 Coming soon
      </Text>
      <Suspense fallback={<Spinner size="medium" />}>
        <Notifications />
      </Suspense>
    </View>
  );
});

export { NotificationsScreen };
