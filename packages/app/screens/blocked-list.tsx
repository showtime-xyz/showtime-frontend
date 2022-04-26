import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

import { BlockedList } from "../components/settings/blocked-list";

const BlockedListScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Blocket List screen");
  }, []);

  return <BlockedList />;
});

export { BlockedListScreen };
