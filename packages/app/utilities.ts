import * as React from "react";
import { Platform } from "react-native";

import { Biconomy } from "@biconomy/mexa";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import removeMd from "remove-markdown";

import { BYPASS_EMAIL, LIST_CURRENCIES } from "app/lib/constants";
import { magic, Magic } from "app/lib/magic";

import { NFT, OwnersListOwner, Profile, WalletAddressesV2 } from "./types";

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

export const getRoundedCount = (count: number = 0) => {
  const digits = `${count}`.split("");

  if (digits[0] == "0") {
    return digits[0];
  }

  switch (digits.length) {
    case 8:
      return `${digits.slice(0, 2).join("")}m`;

    case 7:
      return `${digits[0]}m`;

    case 6:
      return `${digits.slice(0, 3).join("")}k`;

    case 5:
      return `${digits.slice(0, 2).join("")}k`;

    case 4:
      return `${digits[0]}k`;

    case 3:
    case 2:
    case 1:
      return digits.join("");

    default:
      return "00";
  }
};

// Format big numbers
export function formatNumber(number: number) {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
}

export const findListingItemByOwner = (
  nft: NFT | undefined,
  profileID: Profile["profile_id"] | undefined
) => {
  const listedNFT = nft?.listing?.all_sellers?.find((seller) => {
    return seller.profile_id === profileID;
  });

  return listedNFT;
};

/**
 * Check if ANY of the users associated addresses exist in the NFT's owners list.
 */
export const isUserAnOwner = (
  userAddresses?: Profile["wallet_addresses_v2"],
  nftOwnerList?: NFT["multiple_owners_list"]
): boolean => {
  return Boolean(
    userAddresses?.find((addressObject) => {
      return nftOwnerList?.find(
        (owner) =>
          addressObject.address.toLowerCase() ===
            owner.address?.toLowerCase() ||
          addressObject.ens_domain?.toLowerCase() ===
            owner.address?.toLowerCase()
      );
    })
  );
};

/**
 *
 * Returns A list of all user wallet addresses that own an edition of the NFT.
 */
export const findUserInOwnerList = (
  userAddresses?: Profile["wallet_addresses_v2"],
  nftOwnerList?: NFT["multiple_owners_list"]
): WalletAddressesV2[] | undefined => {
  const ownedList = userAddresses?.filter((addressObject) => {
    const hasMatch = nftOwnerList?.find(
      (owner) =>
        addressObject.address.toLowerCase() === owner.address?.toLowerCase() ||
        addressObject.ens_domain?.toLowerCase() === owner.address?.toLowerCase()
    );
    return hasMatch ? true : false;
  });

  return ownedList;
};

/**
 * Returns a wallet address if the passed in address owns an edition of the NFT.
 */
export const findAddressInOwnerList = (
  address?: string,
  userAddresses?: Profile["wallet_addresses_v2"],
  nftOwnerList?: NFT["multiple_owners_list"]
): OwnersListOwner | undefined => {
  const userAddress = userAddresses?.find((addressObject) => {
    return addressObject.address.toLowerCase() === address?.toLowerCase();
  });

  return nftOwnerList?.find(
    (owner) =>
      userAddress?.address?.toLowerCase() === owner.address?.toLowerCase() ||
      userAddress?.ens_domain?.toLowerCase() === owner.address?.toLowerCase()
  );
};

// All our supported currencies have 18 decimals, except for USDC which has 6
export const parseBalance = (
  balance: string,
  currencyAddress: typeof LIST_CURRENCIES
) => {
  const isUSDC = currencyAddress === LIST_CURRENCIES?.USDC;
  if (isUSDC) {
    return parseUnits(balance, 6);
  }

  return parseUnits(balance, 18);
};

export const getMediaUrl = ({
  nft,
  stillPreview,
}: {
  nft: NFT;
  stillPreview: boolean;
}) => {
  if (!nft || (!nft.chain_name && !nft.contract_address && !nft.token_id)) {
    console.warn("NFT is missing fields to get media URL");
    return "";
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/media/nft/${
    nft.chain_name
  }/${nft.contract_address}/${nft.token_id}?cache_key=1${
    stillPreview ? "&still_preview=true" : ""
  }`;
};

export const CARD_DARK_SHADOW =
  Platform.OS === "web"
    ? "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 8px 16px rgba(255, 255, 255, 0.1)"
    : undefined;

export const getPolygonScanLink = (transactionHash: string) => {
  return `https://${
    process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
  }polygonscan.com/tx/${transactionHash}`;
};

export const CONTRACTS = {
  ZORA: "0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7",
  RARIBLE_V2: "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
  RARIBLE_1155: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
  KNOWNORIGIN: "0xfbeef911dc5821886e1dda71586d90ed28174b7d",
  KNOWNORIGIN_V2: "0xabb3738f04dc2ec20f4ae4462c3d069d02ae045b",
  FOUNDATION: "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405",
  SUPERRARE_V1: "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
  SUPERRARE_V2: "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0",
  ASYNCART_V1: "0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad",
  ASYNCART_V2: "0xb6dae651468e9593e4581705a09c10a76ac1e0c8",
  CRYPTOARTAI: "0x3ad503084f1bd8d15a7f5ebe7a038c064e1e3fa1",
  PORTIONIO: "0xda98f59e1edecb2545d7b07b794e704ed6cf1f7a",
  PORTIONIO_1155: "0x0adf0bc748296bcba9f394d783a5f5e9406d6874",
  MINTABLE: "0x8c5acf6dbd24c66e6fd44d4a4c3d7a2d955aaad2", // Gasless store
  EPHIMERA: "0xfe21b0a8df3308c61cb13df57ae5962c567a668a",
  HICETNUNC: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
  KALAMINT: "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse",
};

export const getContractName = (item: NFT) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return "Zora";
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return "Rarible";
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) return "KnownOrigin";
      else return "OpenSea";
    case CONTRACTS.KNOWNORIGIN_V2:
      return "KnownOrigin";
    case CONTRACTS.FOUNDATION:
      return "Foundation";
    case CONTRACTS.SUPERRARE_V1:
    case CONTRACTS.SUPERRARE_V2:
      return "SuperRare";
    case CONTRACTS.ASYNCART_V1:
    case CONTRACTS.ASYNCART_V2:
      return "Async Art";
    case CONTRACTS.PORTIONIO:
    case CONTRACTS.PORTIONIO_1155:
      if (item.token_img_original_url) return "Portion.io";
      else return "OpenSea";
    case CONTRACTS.CRYPTOARTAI:
      if (item.token_edition_identifier) return "CryptoArt.Ai";
      else return "OpenSea";
    case CONTRACTS.MINTABLE:
      if (item.token_listing_identifier) return "Mintable";
      else return "OpenSea";
    case CONTRACTS.EPHIMERA:
      return "Ephimera";
    case CONTRACTS.KALAMINT:
      return "Kalamint";
    case CONTRACTS.HICETNUNC:
      return "Hic Et Nunc";
    default:
      return "OpenSea";
  }
};

export const getBidLink = (item: NFT) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return `https://zora.co/${item.creator_address_nonens}/${item.token_id}`;
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return `https://rarible.com/token/${item.contract_address}:${item.token_id}`;
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) {
        return `https://knownorigin.io/gallery/${item.token_ko_edition}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.KNOWNORIGIN_V2:
      return `https://knownorigin.io/gallery/${item.token_id.slice(0, -3)}000`;
    case CONTRACTS.PORTIONIO:
    case CONTRACTS.PORTIONIO_1155:
      if (item.token_img_original_url) {
        return `https://app.portion.io/#exchange?ID=${item.token_img_original_url.replace(
          "https://ipfs.io/ipfs/",
          ""
        )}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.FOUNDATION:
      return `https://foundation.app/creator/nft-${item.token_id}`;
    case CONTRACTS.SUPERRARE_V1:
      return `https://superrare.co/artwork/${item.token_id}`;
    case CONTRACTS.SUPERRARE_V2:
      return `https://superrare.co/artwork-v2/${item.token_id}`;
    case CONTRACTS.ASYNCART_V1:
      return `https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-${item.token_id}`;
    case CONTRACTS.ASYNCART_V2:
      return `https://async.art/art/master/0xb6dae651468e9593e4581705a09c10a76ac1e0c8-${item.token_id}`;
    case CONTRACTS.CRYPTOARTAI:
      if (item.token_edition_identifier) {
        return `https://cryptoart.ai/gallery/detail?id=${item.token_edition_identifier}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.MINTABLE:
      if (item.token_listing_identifier) {
        return `https://mintable.app/t/item/t/${item.token_listing_identifier}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.EPHIMERA:
      return `https://ephimera.com/tokens/${item.token_id}`;
    case CONTRACTS.KALAMINT:
      if (item.token_edition_identifier) {
        return `https://kalamint.io/collection/${item.token_edition_identifier}`;
      } else {
        return `https://kalamint.io/token/${item.token_id}`;
      }

    case CONTRACTS.HICETNUNC:
      return `https://www.hicetnunc.art/objkt/${item.token_id}`;
    default:
      return `https://opensea.io/assets/${
        item.chain_identifier == 137 ? "matic/" : ""
      }${item.contract_address}/${
        item.token_id
      }?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
  }
};

export const DROPDOWN_LIGHT_SHADOW =
  "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)";
export const DROPDOWN_DRAK_SHADOW =
  "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)";

export const getDropdownShadow = (isDark = false) => {
  const shadow = isDark ? DROPDOWN_DRAK_SHADOW : DROPDOWN_LIGHT_SHADOW;
  return Platform.OS === "web" ? shadow : undefined;
};
