import { MyInfo, NFT } from "app/types";

import { getQueryString, redirectUri } from "./queryString";

const getSpotifyAuthCode = (nft: NFT, user?: MyInfo) => {
  const queryString = getQueryString(nft, user);
  window.location.href = queryString;
  return {
    accessToken: "",
  };
};

export { redirectUri, getSpotifyAuthCode };
