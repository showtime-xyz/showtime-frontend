import { Suspense } from "react";

import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";

import { View, Spinner } from "design-system";

const NotificationsScreen = withColorScheme(() => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      <View tw={`h-[${headerHeight}px] bg-black`} />
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
