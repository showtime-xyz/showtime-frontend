import { Profile } from "./types";
import { Biconomy } from "app/biconomy-sdk/src";
import { ethers } from "ethers";

export const formatAddressShort = (address) => {
  if (!address) return null;

  // Skip over ENS names
  if (address.includes(".")) return address;

  return `${address.slice(0, 4)}…${address.slice(
    address.length - 4,
    address.length
  )}`;
};

export const getProfileName = (profile?: Profile) => {
  if (!profile) {
    return null;
  }

  if (profile.name) {
    return profile.name;
  }

  if (profile.username) {
    return profile.username;
  }

  if (
    profile.wallet_addresses_excluding_email_v2 &&
    profile.wallet_addresses_excluding_email_v2.length > 0
  ) {
    if (profile.wallet_addresses_excluding_email_v2[0].ens_domain) {
      return profile.wallet_addresses_excluding_email_v2[0].ens_domain;
    } else {
      return formatAddressShort(
        profile.wallet_addresses_excluding_email_v2[0].address
      );
    }
  }

  return "Unnamed";
};

const DEFAULT_PROFILE_PIC =
  "https://cdn.tryshowtime.com/profile_placeholder2.jpg";

export const getProfileImage = (profile?: Profile) => {
  return profile?.img_url ?? DEFAULT_PROFILE_PIC;
};

export const SORT_FIELDS = {
  LIKE_COUNT: { label: "Popularity", key: "like_count", id: 1, value: 1 },
  NEWEST: {
    label: "Newest",
    key: "newest",
    id: 2,
    value: 2,
  },
  OLDEST: {
    label: "Oldest",
    key: "oldest",
    id: 3,
    value: 3,
  },
  COMMENT_COUNT: { label: "Comments", key: "comment_count", id: 4, value: 4 },
  // CUSTOM: { label: "Custom", key: "custom", id: 5, value: 5 },
};

export const getSortFields = () => {
  return [...Object.keys(SORT_FIELDS).map((key) => SORT_FIELDS[key])];
};

const getProviderFromWallectConnect = (connector) => {
  return {
    ...connector,
    sign: (...params) => {},
  };
};

export const getBiconomy = async (connector) => {
  const WalletConnectProvider = (await import("@walletconnect/web3-provider"))
    .default;

  const provider = new WalletConnectProvider({
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  });

  // provider.accounts = connector.accounts;
  // const provider = getProviderFromWallectConnect(connector);
  const web3 = new ethers.providers.Web3Provider(provider);

  // const newProvider = {
  //   ...web3.provider,
  //   ...connector,
  // };

  const biconomy = new Biconomy(
    new ethers.providers.JsonRpcProvider(
      `https://polygon-${
        process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "mainnet"
      }.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
    ),
    {
      apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY,
      walletProvider: {
        send: async (...params) => {
          if (params[0].method === "eth_signTypedData_v4") {
            const res = await connector.sendCustomRequest(params);
            console.log("ress", res);
            return res;
          }
        },
      },
      debug: true,
    }
  );

  await new Promise((resolve, reject) =>
    biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject)
  );

  return { biconomy, web3 };
};
