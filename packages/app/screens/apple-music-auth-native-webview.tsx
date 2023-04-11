import { WebView } from "react-native-webview";

import { useRouter } from "@showtime-xyz/universal.router";

import { tokenPromiseCallbacks } from "../hooks/use-connect-apple-music/utils";

const webAppleMusicScreenURL =
  "http://192.168.0.241:3000/apple-music-auth/apple-music-auth?wed=2344";

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
