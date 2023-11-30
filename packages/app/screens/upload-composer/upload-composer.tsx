import { withColorScheme } from "app/components/memo-with-theme";
import UploadComposer from "app/components/upload/composer";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

export const UploadComposerScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Upload Video Composer" });
  useAuthScreen();

  return <UploadComposer />;
});
