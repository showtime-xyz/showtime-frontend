import { MyInfo, NFT } from "../../types";

const scope =
  "user-top-read user-read-recently-played user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read";

export const redirectUri = `${
  __DEV__
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
}/spotify-auth/redirect`;

const clientID = "e12f7eea542947ff843cfc68d762235a";

export const getSpotifyAuthCode = (nft: NFT, user?: MyInfo) => {
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

  console.log(" queryString", queryString, state);
  window.location.href = `https://accounts.spotify.com/authorize?${queryString}`;

  return {
    accessToken: "",
  };
};
