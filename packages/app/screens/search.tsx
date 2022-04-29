import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";

import { View } from "design-system/view";

const SearchScreen = withColorScheme(() => {
  return (
    <View tw="w-full">
      <Search />
    </View>
  );
});

export { SearchScreen };
