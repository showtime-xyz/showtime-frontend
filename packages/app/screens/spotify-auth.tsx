import { useEffect } from "react";
import { Platform } from "react-native";

import { AvoidSoftInput } from "react-native-avoid-softinput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Close } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
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

  const insets = useSafeAreaInsets();

  if (uri) {
    return (
      <View tw="flex-1">
        <WebView
          nestedScrollEnabled
          incognito
          style={{
            flex: 1,
            marginTop: Platform.OS === "android" ? insets.top : 0,
          }}
          source={{ uri }}
          userAgent={
            "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
          }
          onMessage={async (s) => {
            if (s.nativeEvent.data) {
              const { code } = JSON.parse(s.nativeEvent.data);
              await saveSpotifyToken({ code, redirectUri });
              router.pop();
            }
          }}
        />
        {Platform.OS === "android" ? (
          <Pressable
            onPress={router.pop}
            tw="absolute top-9 left-2 rounded-full bg-gray-100 p-3"
          >
            <Close color={colors.gray[800]} height={28} width={28} />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return null;
};
