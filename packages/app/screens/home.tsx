import { useEffect } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return (
    <ErrorBoundary>
      <Feed />
    </ErrorBoundary>
  );
});

export { HomeScreen };
