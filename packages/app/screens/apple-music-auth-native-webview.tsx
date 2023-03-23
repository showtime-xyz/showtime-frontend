import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";

import { tokenPromiseCallbacks } from "../hooks/use-apple-music-token/utils";

const webAppleMusicScreenURL =
  "https://5b62-103-85-11-185.in.ngrok.io/apple-music-auth/apple-music-auth?wed=2344";

export const AppleMusicAuthNativeWebViewScreen = () => {
  const router = useRouter();
  return (
    <WebView
      source={{
        uri: webAppleMusicScreenURL,
      }}
      incognito
      onMessage={(event) => {
        console.log("Received message from webview: ", event.nativeEvent.data);
        tokenPromiseCallbacks.resolve(event.nativeEvent.data);
        router.pop();
      }}
    />
  );
};
