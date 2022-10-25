import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { redirectUri } from "app/lib/spotify/queryString";
import { createParam } from "app/navigation/use-param";

type Query = {
  uri?: string;
};

const { useParam } = createParam<Query>();

export const SpotifyAuth = () => {
  const [uri] = useParam("uri");
  const router = useRouter();
  const { saveSpotifyToken } = useSaveSpotifyToken();

  if (uri) {
    return (
      <View tw="flex-1">
        <WebView
          style={{ flex: 1 }}
          source={{ uri }}
          onMessage={async (s) => {
            if (s.nativeEvent.data) {
              const { code } = JSON.parse(s.nativeEvent.data);
              await saveSpotifyToken({ code, redirectUri });
              router.pop();
            }
          }}
        />
      </View>
    );
  }

  return null;
};
