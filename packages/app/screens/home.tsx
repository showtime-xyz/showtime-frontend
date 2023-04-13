import dynamic from "next/dynamic";

import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const FeedDesktop = dynamic(() => import("app/components/feed/feed.md"), {
  ssr: false,
});
const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  return (
    <ErrorBoundary>
      <View tw="md:hidden">
        <Feed />
      </View>
      <View tw="hidden md:flex">
        <FeedDesktop />
      </View>
    </ErrorBoundary>
  );
});

export { HomeScreen };
