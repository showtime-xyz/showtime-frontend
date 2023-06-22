import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";
import { useTrackPageViewed } from "app/lib/analytics";

export const SearchScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Search" });
  return (
    <View tw="w-full flex-1 bg-white dark:bg-black">
      <View tw="max-w-screen-content mx-auto w-full bg-white dark:bg-black">
        <Search />
      </View>
    </View>
  );
});
