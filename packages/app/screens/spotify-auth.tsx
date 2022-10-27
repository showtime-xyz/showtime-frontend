import { useEffect } from "react";
import { Platform } from "react-native";

import { AvoidSoftInput } from "react-native-avoid-softinput";
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

  useEffect(() => {
    AvoidSoftInput.setEnabled(false);
    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  if (uri) {
    return (
      <View tw="flex-1">
        <WebView
          style={{ flex: 1 }}
          source={{ uri }}
          userAgent={
            Platform.OS === "ios"
              ? "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
              : undefined
          }
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
