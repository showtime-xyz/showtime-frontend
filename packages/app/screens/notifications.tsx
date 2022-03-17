import { Suspense } from "react";
import { Platform } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";

import { View, Spinner } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
      <Suspense
        fallback={
          <View tw="mt-10 items-center justify-center">
            <Spinner size="small" />
          </View>
        }
      >
        <Notifications />
      </Suspense>
    </>
  );
});

export { NotificationsScreen };
