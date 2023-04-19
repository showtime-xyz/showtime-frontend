import dynamic from "next/dynamic";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { withColorScheme } from "app/components/memo-with-theme";
import Trending from "app/components/trending";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

const FeedDesktop = dynamic(() => import("app/components/feed/feed.md"), {
  ssr: false,
});
const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Trending />;
  }
  return (
    <ErrorBoundary>
      <Hidden from="md">
        <Feed />
      </Hidden>
      <Hidden until="md">
        <FeedDesktop />
      </Hidden>
    </ErrorBoundary>
  );
});

export { HomeScreen };
