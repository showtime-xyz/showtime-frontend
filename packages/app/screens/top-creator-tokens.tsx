import { TopCreatorTokens } from "app/components/creator-tokens/top-creator-tokens";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const TopCreatorTokensScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "TopCreatorTokens" });

  return <TopCreatorTokens />;
});

export { TopCreatorTokensScreen };
