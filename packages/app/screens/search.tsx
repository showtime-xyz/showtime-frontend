import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";
import { mixpanel } from "app/lib/mixpanel";

const SearchScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Search view");
  }, []);

  return <Search />;
});

export { SearchScreen };
