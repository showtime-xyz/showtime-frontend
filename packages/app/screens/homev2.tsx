import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import FeedDesktop from "app/components/feed/feed.md";
import { Home } from "app/components/home";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
});
