import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

const MarketplaceScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Marketplace" });
  const headerHeight = useHeaderHeight();

  return (
    <>
      <View tw={`bg-black`} style={{ height: headerHeight }} />

      <View tw="p-4">
        <Text tw="font-space-bold text-2xl font-extrabold text-black dark:text-white">
          Discover
        </Text>
        <View tw="h-6" />
        <Text tw="font-semibold text-gray-600 dark:text-gray-400">
          🚧 Coming soon
        </Text>
      </View>
    </>
  );
});

export { MarketplaceScreen };
