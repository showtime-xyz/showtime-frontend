import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";
import { useTrackPageViewed } from "app/lib/analytics";

const SearchScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Search" });

  return (
    <View tw="w-full">
      <Search />
    </View>
  );
});

export { SearchScreen };
