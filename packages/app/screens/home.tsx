import { useEffect } from "react";
import { useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { Feed as FeedDesktop } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  const { width } = useWindowDimensions();
  return (
    <ErrorBoundary>{width < 768 ? <Feed /> : <FeedDesktop />}</ErrorBoundary>
  );
});

export { HomeScreen };
