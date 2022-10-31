import { Platform } from "react-native";

import { MyInfo, NFT } from "app/types";

export const redirectUri = Platform.select({
  web: `${
    __DEV__
      ? "http://localhost:3000"
      : "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
  }/spotify-auth/redirect`,
  default: `io.showtime${__DEV__ ? ".development" : ""}://spotify-success`,
});

export const scope = "user-library-modify";

export const clientID = "e12f7eea542947ff843cfc68d762235a";

export const getQueryString = (nft: NFT, user?: MyInfo) => {
  const state = `chainName=${nft.chain_name}&tokenId=${nft.token_id}&contractAddress=${nft.contract_address}&userId=${user?.data.profile.profile_id}`;

  const params = {
    client_id: clientID,
    scope,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
  };

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return `https://accounts.spotify.com/authorize?${queryString}`;
};
