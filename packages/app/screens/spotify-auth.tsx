import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { createParam } from "app/navigation/use-param";

type Query = {
  uri?: string;
};

const { useParam } = createParam<Query>();

export const SpotifyAuth = () => {
  const [uri] = useParam("uri");
  const router = useRouter();
  const { saveSpotifyToken } = useSaveSpotifyToken();

  return (
    <View tw="flex-1">
      <WebView
        style={{ flex: 1 }}
        source={{ uri }}
        onMessage={async (s) => {
          if (s.nativeEvent.data) {
            const { code } = JSON.parse(s.nativeEvent.data);
            await saveSpotifyToken({ code });
            router.pop();
          }
        }}
      />
    </View>
  );
};
