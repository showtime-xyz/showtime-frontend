import { useEffect } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { Feed as FeedDesktop } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

import { Hidden } from "design-system/hidden";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return (
    <ErrorBoundary>
      <Hidden from="md">
        <Feed />
      </Hidden>
      <Hidden till="md">
        <FeedDesktop />
      </Hidden>
    </ErrorBoundary>
  );
});

export { HomeScreen };
