import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";

import { tokenPromiseCallbacks } from "../hooks/use-connect-apple-music/utils";

const webAppUrl = !__DEV__
  ? "http://192.168.0.241:3000"
  : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`;

const webAppleMusicScreenURL = `${webAppUrl}/apple-music-auth/apple-music-auth`;

export const AppleMusicAuthNativeWebViewScreen = () => {
  const router = useRouter();
  return (
    <WebView
      source={{
        uri: webAppleMusicScreenURL,
      }}
      incognito
      onMessage={(event) => {
        tokenPromiseCallbacks.resolve(event.nativeEvent.data);
        router.pop();
      }}
    />
  );
};
