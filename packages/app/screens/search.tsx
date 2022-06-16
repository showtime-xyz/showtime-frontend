import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";
import { useTrackPageViewed } from "app/lib/analytics";

import { View } from "design-system/view";

const SearchScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Search" });

  return (
    <View tw="w-full">
      <Search />
    </View>
  );
});

export { SearchScreen };
