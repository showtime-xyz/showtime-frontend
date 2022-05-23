import { Platform } from "react-native";

import localhost from "react-native-localhost";

function getAPIUrl(uri: string) {
  const endpoint = Platform.select({
    web: "",
    default:
      process.env.NEXT_PUBLIC_URL !== null && process.env.NEXT_PUBLIC_URL !== ""
        ? process.env.NEXT_PUBLIC_URL
        : `http://${localhost}:3000`,
  });

  return `${endpoint}${uri}`;
}

export { getAPIUrl };
