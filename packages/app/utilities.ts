import * as React from "react";

import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import removeMd from "remove-markdown";

import { BYPASS_EMAIL } from "app/lib/constants";
import { magic, Magic } from "app/lib/magic";

import { Profile } from "./types";

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

export const getBiconomy = async (connector: any, provider: any) => {
  // Here provider refers to magic rpc provider and connector could be wallet connect's connector instance
  const walletProvider = provider
    ? {
        walletProvider: provider.provider,
      }
    : {
        signFunction: (signedDataType: string, params: any) => {
          return new Promise((resolve, reject) => {
            if (signedDataType === "eth_signTypedData_v4") {
              connector
                .signTypedData(params)
                .then((res: string) => {
                  console.log("received signature from wallet ", res);
                  resolve(res);
                })
                .catch((err: any) => {
                  // TODO: this never gets logged!
                  console.log("received error on signing ");
                  console.error(err);
                  reject(err);
                });
            }
          });
        },
      };
  const biconomy = new Biconomy(
    new ethers.providers.JsonRpcProvider(
      `https://polygon-${
        process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "mainnet"
      }.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
    ),
    {
      apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY,
      // TODO: add walletconnect connector instance support in biconomy
      ...walletProvider,
      // debug: true,
    }
  );

  await new Promise((resolve, reject) =>
    biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject)
  );

  return { biconomy, connector };
};

export const NFT_DETAIL_API = "/v2/nft_detail";

export const removeTags = (text: string) => {
  return removeMd(text.replace(/(<([^>]+)>)/gi, " "));
};

type ReactChildArray = ReturnType<typeof React.Children.toArray>;

export function flattenChildren(children: React.ReactNode): ReactChildArray {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.reduce((flatChildren: ReactChildArray, child) => {
    if ((child as React.ReactElement<any>).type === React.Fragment) {
      return flatChildren.concat(
        flattenChildren((child as React.ReactElement<any>).props.children)
      );
    }
    flatChildren.push(child);
    return flatChildren;
  }, []);
}
/**
 * Under matching conditions return an instance of magic in test mode
 */
export const overrideMagicInstance = (email: string) => {
  if (email === BYPASS_EMAIL) {
    const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";
    // Default to polygon chain
    const customNodeOptions = {
      rpcUrl: "https://rpc-mainnet.maticvigil.com/",
      chainId: 137,
    };

    if (isMumbai) {
      console.log("Magic network is connecting to Mumbai testnet");
      customNodeOptions.rpcUrl =
        "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
      customNodeOptions.chainId = 80001;
    }

    const testMagic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
      network: customNodeOptions,
      testMode: true,
    });
    return testMagic;
  }

  return magic;
};
