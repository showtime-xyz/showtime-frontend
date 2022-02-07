import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Search } from "app/components/search";
import { withColorScheme } from "app/components/memo-with-theme";

const SearchScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Search view");
  }, []);

  return <Search />;
});

export { SearchScreen };
