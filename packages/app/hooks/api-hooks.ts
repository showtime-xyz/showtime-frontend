import { Profile } from "../types";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { NFT } from "../types";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";
import useSWR from "swr";
import { useUser } from "./use-user";
import { v4 as uuid } from "uuid";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { formatAddressShort, getBiconomy } from "../utilities";
import { ethers } from "ethers";
import minterAbi from "app/abi/ShowtimeMT.json";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { AppContext } from "../context/app-context";

console.log("app env ", process.env);
export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const { isAuthenticated } = useUser();

  const activityURLFn = useCallback(
    (index) => {
      const url = `/v2/${
        isAuthenticated ? "activity_with_auth" : "activity_without_auth"
      }?page=${index + 1}&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit, isAuthenticated]
  );

  const queryState = useInfiniteListQuerySWR<any>(activityURLFn);

  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

export const useTrendingCreators = ({ days }: { days: number }) => {
  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `/v1/leaderboard?page=${index + 1}&days=${days}&limit=15`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn);
  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
    fetchMore: useCallback(() => {}, []),
  };
};

export const useTrendingNFTS = ({ days }: { days: number }) => {
  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `/v2/featured?page=${index + 1}&days=${days}&limit=10`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn);

  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

export const useUserProfile = ({ address }: { address?: string }) => {
  const { data, error } = useSWR<{ data: UserProfile }>(
    address ? "/v4/profile_server/" + address : null,
    fetcher
  );

  return { data, loading: !data, error };
};

export interface UserProfile {
  profile: Profile;
  following_count: number;
  followers_count: number;
  featured_nft: NFT;
}

type UserProfileNFTs = {
  profileId?: number;
  listId: number;
  sortId?: number;
  showDuplicates?: number;
  showHidden?: number;
  collectionId?: number;
};

type UseProfileNFTs = {
  data: {
    items: Array<NFT>;
    hasMore: boolean;
  };
};

export const defaultFilters = {
  showDuplicates: 0,
  showHidden: 0,
  collectionId: 0,
  sortId: 1,
};

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const {
    profileId,
    listId,
    sortId = defaultFilters.sortId,
    showDuplicates = defaultFilters.showDuplicates,
    showHidden = defaultFilters.showHidden,
    collectionId = defaultFilters.collectionId,
  } = params;

  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `v1/profile_nfts?profile_id=${profileId}&page=${
        index + 1
      }&limit=${8}&list_id=${listId}&sort_id=${sortId}&show_hidden=${showHidden}&show_duplicates=${showDuplicates}&collection_id=${collectionId}`;
      return url;
    },
    [profileId, listId, sortId, showDuplicates, showHidden, collectionId]
  );

  const queryState = useInfiniteListQuerySWR<UseProfileNFTs>(
    params.profileId ? trendingCreatorsUrlFn : null
  );

  const newData = useMemo(() => {
    let newData: NFT[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data.items);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const fetchMore = () => {
    if (queryState.data?.[queryState.data.length - 1].data.hasMore) {
      queryState.fetchMore();
    }
  };

  return { ...queryState, fetchMore, data: newData };
};

export type Collection = {
  collection_id: number;
  collection_name: string;
  collection_img_url: string;
  count?: number;
};

export type List = {
  id: number;
  name: string;
  count_deduplicated_nonhidden: number;
  count_deduplicated_withhidden: number;
  count_all_nonhidden: number;
  count_all_withhidden: number;
  sort_id: number;
  collections: Array<Collection>;
  has_custom_sort: boolean;
};

type ProfileTabsAPI = {
  data: {
    default_list_id: number;
    lists: Array<List>;
  };
};

export const useProfileNftTabs = ({ profileId }: { profileId?: number }) => {
  const { data, error } = useSWR<ProfileTabsAPI>(
    profileId ? "/v1/profile_tabs/" + profileId : null,
    fetcher
  );

  return { data, loading: !data, error };
};

export const useComments = ({ nftId }: { nftId: number }) => {
  const commentsUrlFn = useCallback(
    (index) => {
      const url = `/v2/comments/${nftId}?limit=10`;
      return url;
    },
    [nftId]
  );

  const queryState = useInfiniteListQuerySWR<any>(commentsUrlFn);

  return queryState;
};

type MintNFTType = {
  status:
    | "idle"
    | "fileUpload"
    | "fileUploadError"
    | "minting"
    | "mintingError"
    | "mintingSuccess";

  tokenId?: string;
  transaction?: string;
};

const initialMintNFTState: MintNFTType = {
  status: "idle",
  tokenId: undefined,
  transaction: undefined,
};

const mintNFTReducer = (state: MintNFTType, action: any): MintNFTType => {
  switch (action.type) {
    case "fileUpload":
      return {
        ...state,
        status: "fileUpload",
        tokenId: undefined,
        transaction: undefined,
      };
    case "fileUploadError":
      return { ...state, status: "fileUploadError" };
    case "minting":
      return {
        ...state,
        status: "minting",
        tokenId: undefined,
        transaction: undefined,
      };
    case "mintingError":
      return { ...state, status: "mintingError" };
    case "mintingSuccess":
      return {
        ...state,
        status: "mintingSuccess",
        tokenId: action.tokenId,
        transaction: action.transaction,
      };
    default:
      return state;
  }
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

type UseMintNFT = {
  filePath: string;
  title: string;
  description: string;
  notSafeForWork: boolean;
  editionCount: number;
  royaltiesPercentage: number;
};

const supportedImageExtensions = ["jpg", "jpeg", "png", "gif"];
const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

const getFileNameAndType = (filePath: string) => {
  const fileName = filePath.split("/").pop();
  const fileExtension = fileName?.split(".").pop();
  if (fileExtension && supportedImageExtensions.includes(fileExtension)) {
    return {
      name: fileName,
      type: "image/" + fileExtension,
    };
  } else if (
    fileExtension &&
    supportedVideoExtensions.includes(fileExtension)
  ) {
    return {
      name: fileName,
      type: "video/" + fileExtension,
    };
  }
};
const getPinataToken = (publicAddress: string) => {
  return axios
    .post(
      "https://api.pinata.cloud/users/generateApiKey",
      {
        maxUses: 1,
        keyName: `${formatAddressShort(publicAddress)}'s key`,
        permissions: {
          endpoints: {
            pinning: {
              pinFileToIPFS: true,
              pinJSONToIPFS: true,
            },
          },
        },
      },

      {
        headers: {
          // TODO: Move this to new pinata backend API
          Authorization: `Bearer ${process.env.PINATA_TOKEN}`,
        },
      }
    )
    .then((res) => res.data.JWT);
};

export const useMintNFT = () => {
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState<string>();
  const context = useContext(AppContext);

  useEffect(() => {
    if (
      user?.data &&
      user?.data.profile.wallet_addresses_excluding_email_v2[0]
    ) {
      setUserAddress(
        user.data.profile.wallet_addresses_excluding_email_v2[0].address
      );
    }
    // Web3 is initialised for magic users
    else if (context.web3) {
      const signer = context.web3.getSigner();
      signer.getAddress().then((addr: string) => {
        setUserAddress(addr);
      });
    }
  }, [user, context.web3]);

  const connector = useWalletConnect();

  async function uploadFile(params: UseMintNFT) {
    if (userAddress) {
      const fileMetaData = getFileNameAndType(params.filePath);
      const fileInfo = await FileSystem.getInfoAsync(params.filePath);
      if (typeof fileInfo.size === "number" && fileInfo.size > MAX_FILE_SIZE) {
        // TODO: improve alert
        Alert.alert("File too big! Please use a file smaller than 50MB.");
        return;
      }

      console.log("Received file meta data ", fileMetaData);

      if (fileMetaData) {
        const pinataToken = await getPinataToken(userAddress);

        const formData = new FormData();

        formData.append("file", {
          //@ts-ignore
          uri: params.filePath,
          name: fileMetaData.name,
          type: fileMetaData.type,
        });

        formData.append(
          "pinataMetadata",
          JSON.stringify({
            name: uuid(),
          })
        );

        const fileIpfsHash = await axios
          .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              Authorization: `Bearer ${pinataToken}`,
              "Content-Type": `multipart/form-data`,
            },
          })
          .then((res) => res.data.IpfsHash);

        console.log("Uploaded file to ipfs ", fileIpfsHash);

        if (fileIpfsHash) {
          const pinataToken = await getPinataToken(userAddress);

          const nftJson = await axios
            .post(
              "https://api.pinata.cloud/pinning/pinJSONToIPFS",
              {
                pinataMetadata: { name: uuid() },
                pinataContent: {
                  name: params.title,
                  description: params.description,
                  image: `ipfs://${fileIpfsHash}`,
                  ...(params.notSafeForWork
                    ? { attributes: [{ value: "NSFW" }] }
                    : {}),
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${pinataToken}`,
                },
              }
            )
            .then((res) => res.data.IpfsHash);
          console.log("Uploaded nft json to ipfs ", nftJson);

          return nftJson;
        }
      }
    }
  }

  async function mintToken({
    nftJsonIpfsHash,
    ...params
  }: {
    nftJsonIpfsHash: string;
  } & UseMintNFT) {
    return new Promise<{ transaction: string; tokenId: number }>(
      async (resolve, reject) => {
        const { biconomy } = await getBiconomy(connector, context.web3);

        const contract = new ethers.Contract(
          //@ts-ignore
          process.env.NEXT_PUBLIC_MINTING_CONTRACT,
          minterAbi,
          biconomy.getSignerByAddress(userAddress)
        );

        const { data } = await contract.populateTransaction.issueToken(
          userAddress,
          params.editionCount,
          nftJsonIpfsHash,
          0,
          userAddress,
          params.royaltiesPercentage * 100
        );
        const provider = biconomy.getEthersProvider();

        console.log("** minting: opening wallet for signing **");

        const transaction = await provider
          .send("eth_sendTransaction", [
            {
              data,
              from: userAddress,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ])
          .catch((error: any) => {
            // TODO: Add a proper error message. Find what 4001 means
            if (error.code === 4001) {
              reject("Something went wrong");
            }

            if (
              JSON.parse(
                error?.body || error?.error?.body || "{}"
              )?.error?.message?.includes("caller is not minter")
            ) {
              reject("Your address is not approved for minting");
            }

            reject("Something went wrong");
          });

        // console.log("transaction hash ", transaction);

        provider.once(transaction, (result: any) => {
          // console.log(
          //   "token id! ",
          //   contract.interface
          //     .decodeFunctionResult("issueToken", result.logs[0].data)[0]
          //     .toNumber()
          // );
          resolve({
            tokenId: contract.interface
              .decodeFunctionResult("issueToken", result.logs[0].data)[0]
              .toNumber(),
            transaction: transaction,
          });
        });
      }
    );
  }

  async function mintTokenPipeline(params: UseMintNFT) {
    let nftJsonIpfsHash;

    if (userAddress) {
      console.log("** Begin file upload **");
      try {
        dispatch({ type: "fileUpload" });
        nftJsonIpfsHash = await uploadFile(params);
        console.log("** File upload success **");
      } catch (e) {
        console.error("file upload error ", e);
        dispatch({ type: "fileUploadError" });
        throw e;
      }

      if (nftJsonIpfsHash) {
        try {
          dispatch({ type: "minting" });
          console.log("** Begin minting **");
          const response = await mintToken({ nftJsonIpfsHash, ...params });
          dispatch({
            type: "mintingSuccess",
            tokenId: response.tokenId,
            transaction: response.tokenId,
          });
          console.log("** minting success **");
        } catch (e) {
          dispatch({ type: "mintingError" });
          throw e;
        }
      }
    } else {
      // TODO: better error handling. Maybe show login screen
      Alert.alert(
        "Sorry! We can't find your user address. Please login with a wallet or email/phone"
      );
    }
  }

  console.log("state ", state);

  return { state, startMinting: mintTokenPipeline };
};
