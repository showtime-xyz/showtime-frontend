import { withColorScheme } from "app/components/memo-with-theme";
import UploadPreview from "app/components/upload/preview";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

const UploadPreviewScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Upload Video Composer" });
  useAuthScreen();

  return <UploadPreview />;
});

export { UploadPreviewScreen };
