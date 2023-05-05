import { useRef, useEffect } from "react";

import { WebView } from "react-native-webview";
import useSWR from "swr";

import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { axios } from "app/lib/axios";
import { captureException } from "app/lib/sentry";

import { tokenPromiseCallbacks } from "../hooks/use-connect-apple-music/utils";

const webAppleMusicScreenURL = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/apple-music-auth-native-webview/apple-music-auth-native-webview.html`;

export const AppleMusicAuthNativeWebViewScreen = () => {
  const router = useRouter();
  const authorized = useRef(false);
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
      <View tw="flex-1 items-center justify-center bg-red-500">
        <Spinner />
      </View>
    );
  }

  if (state.data?.developer_token) {
    return (
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
    );
  }

  return null;
};
