import { useRef, useEffect } from "react";
import { Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import useSWR from "swr";

import { Close } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { axios } from "app/lib/axios";
import { captureException } from "app/lib/sentry";

import { tokenPromiseCallbacks } from "../hooks/use-connect-apple-music/utils";

const webAppleMusicScreenURL = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/apple-music-auth-native-webview/apple-music-auth-native-webview.html`;

export const AppleMusicAuthNativeWebViewScreen = () => {
  const router = useRouter();
  const authorized = useRef(false);
  const insets = useSafeAreaInsets();
  const state = useSWR<{ developer_token: string }>(
    "/v1/apple_music/get-dev-token",
    (url) => {
      return axios({ url, method: "GET" });
    },
    {
      onError: (error) => {
        captureException(error);
      },
      refreshInterval: 60 * 1000,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    return () => {
      if (!authorized.current) {
        tokenPromiseCallbacks.reject("User canceled");
      }
    };
  }, []);

  if (state.isLoading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (state.data?.developer_token) {
    return (
      <View
        tw="flex-1"
        style={{
          marginTop: Platform.OS === "android" ? insets.top : 0,
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            padding: 8,
          }}
          onPress={() => router.pop()}
        >
          <Close height={32} width={32} color={colors.gray[400]} />
        </Pressable>
        <WebView
          source={{
            uri:
              webAppleMusicScreenURL +
              `?developerToken=${state.data?.developer_token}`,
          }}
          incognito
          onMessage={(event) => {
            tokenPromiseCallbacks.resolve(event.nativeEvent.data);
            authorized.current = true;
            router.pop();
          }}
        />
      </View>
    );
  }

  return null;
};
