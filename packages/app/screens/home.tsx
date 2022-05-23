import { useEffect } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import { Feed as FeedDesktop } from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";
import { useRouter } from "app/navigation/use-router";

import { Hidden } from "design-system/hidden";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/collection/0xe5D263D60CB16A5C1eA898eDF414180B3d6d68f8");
    }, 4000);
  }, [router]);

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
