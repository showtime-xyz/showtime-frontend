import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View, Text } from "design-system";

const MarketplaceScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Marketplace" });
  const headerHeight = useHeaderHeight();

  return (
    <>
      <View tw={`h-[${headerHeight}px] bg-black`} />

      <View tw="p-4">
        <Text variant="text-2xl" tw="font-extrabold text-black dark:text-white">
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
