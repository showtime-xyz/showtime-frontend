import { SelfServeExplainer } from "app/components/creator-tokens/self-serve-explainer";
import { withColorScheme } from "app/components/memo-with-theme";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

export const CreatorTokensSelfServeExplainerScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Tokens self serve explainer" });
  useUser({
    redirectTo: "/login",
  });

  return <SelfServeExplainer />;
});
