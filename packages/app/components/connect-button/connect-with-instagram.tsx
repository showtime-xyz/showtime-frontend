import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";

export const redirectURI = Platform.select({
  web: `${
    __DEV__
      ? "http://localhost:3000"
      : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
  }/instagram-oauth-redirect`,
  default: `io.showtime${
    __DEV__ ? ".development" : ""
  }://instagram-oauth-redirect`,
});

let redirectAPIHandler = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/api/instagram-oauth-redirect`;

export const ConnectWithInstagram = () => {
  const Alert = useAlert();
  const handleConnectWithInstagram = async () => {
    const url = `https://api.instagram.com/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      redirectAPIHandler
    )}&response_type=code&scope=user_profile&state=${encodeURIComponent(
      redirectURI
    )}`;

    const res = await WebBrowser.openAuthSessionAsync(url, redirectURI);
    if (res.type === "success") {
      let urlObj = new URL(res.url);
      const code = urlObj.searchParams.get("code");
      if (code) {
        console.log("code ", code);
        Alert.alert("Success", "Connected with Instagram");
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  return (
    <Button onPress={handleConnectWithInstagram}>Connect with Instagram</Button>
  );
};
