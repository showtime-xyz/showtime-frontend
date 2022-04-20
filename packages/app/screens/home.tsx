import { Suspense, useEffect } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Feed />
      </Suspense>
    </ErrorBoundary>
  );
});

export { HomeScreen };
