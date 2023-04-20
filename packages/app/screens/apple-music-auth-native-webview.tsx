import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";

import { tokenPromiseCallbacks } from "../hooks/use-connect-apple-music/utils";

const webAppleMusicScreenURL = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/apple-music-auth/apple-music-auth`;

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
