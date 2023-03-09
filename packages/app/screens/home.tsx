import { withColorScheme } from "app/components/memo-with-theme";
import { useAppleMusicSave } from "app/hooks/use-apple-music-save";
import { useTrackPageViewed } from "app/lib/analytics";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const { authorize, loading, storeSongToUserLibrary } = useAppleMusicSave();

  console.log("loading", loading);
  return (
    <button
      style={{ marginTop: 100 }}
      onClick={async () => {
        const v = await authorize();
        storeSongToUserLibrary(1646181387, v);
      }}
    >
      Save song to library {loading ? "loading..." : null}
    </button>
  );
});

export { HomeScreen };
