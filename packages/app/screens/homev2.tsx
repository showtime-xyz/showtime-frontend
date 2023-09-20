import { Home } from "app/components/home";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  return <Home />;
});
