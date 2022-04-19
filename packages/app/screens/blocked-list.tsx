import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const BlockedListScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Blocket List screen");
  }, []);

  return null;
});

export { BlockedListScreen };
