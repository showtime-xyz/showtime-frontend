import { useEffect } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { Feed as FeedDesktop } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

import { Hide, Show } from "design-system/show";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return (
    <ErrorBoundary>
      <Hide from="md">
        <Feed />
      </Hide>
      <Show from="md">
        <FeedDesktop />
      </Show>
    </ErrorBoundary>
  );
});

export { HomeScreen };
