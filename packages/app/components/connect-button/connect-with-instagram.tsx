import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";

export const ConnectWithInstagram = () => {
  const Alert = useAlert();
  const handleConnectWithInstagram = async () => {
    const redirectUri = "https://dev.showtime.xyz/instagram-oauth-redirect";
    const url = `https://www.instagram.com/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=user_profile`;

    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      const res = await WebBrowser.openAuthSessionAsync(url, redirectUri);
      if (res.type === "success") {
        let urlObj = new URL(res.url);
        const code = urlObj.searchParams.get("code");
        if (code) {
          console.log("code ", code);
        }
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  return (
    <Button onPress={handleConnectWithInstagram}>Connect with Instagram</Button>
  );
};
