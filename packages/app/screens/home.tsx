import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { Feed as FeedDesktop } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  return (
    <ErrorBoundary>
      <Hidden from="md" unmount>
        <Feed />
      </Hidden>
      <Hidden until="md" unmount>
        <FeedDesktop />
      </Hidden>
    </ErrorBoundary>
  );
});

export { HomeScreen };
