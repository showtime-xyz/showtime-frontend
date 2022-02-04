import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { withColorScheme } from "app/components/memo-with-theme";

const ListScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("NFT list view");
  }, []);

  return null;
});

export { ListScreen };
