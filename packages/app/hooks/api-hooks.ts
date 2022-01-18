import { Profile } from "../types";
import { useCallback, useEffect, useMemo, useReducer } from "react";
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
};

const initialMintNFTState: MintNFTType = {
  status: "idle",
};

const mintNFTReducer = (state: MintNFTType, action: any): MintNFTType => {
  switch (action.type) {
    case "fileUpload":
      return { ...state, status: "fileUpload" };
    case "fileUploadError":
      return { ...state, status: "fileUploadError" };
    case "minting":
      return { ...state, status: "minting" };
    case "mintingError":
      return { ...state, status: "mintingError" };
    case "mintingSuccess":
      return { ...state, status: "mintingSuccess" };
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
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZWZjNDc5YS01ODhlLTQ2ZWYtYjY3Zi01ZWYzYTUwYjEzYzUiLCJlbWFpbCI6ImFsZXgua2lsa2thQHRyeXNob3d0aW1lLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhNTkxMzIyNzVjZTUzMGVjYjE2NSIsInNjb3BlZEtleVNlY3JldCI6IjNiMjkxOTFkZDI4Nzc3Njk5NmQ0ZmZkOGJmZTcwZTE4MDU5YjE2ZmJhOWE0ZDhhYjE0YjkzMjMwZjU0YTE0ZjEiLCJpYXQiOjE2MjUxNTQzNzd9.7630gOVEohas0G-OWl2xPdXUJRWdOxJDHkFen1cO7Ak`,
        },
      }
    )
    .then((res) => res.data.JWT);
};

const testAddress = "0x3CFa5Fe88512Db62e40d0F91b7E59af34C1b098f";

export const useMintNFT = ({
  filePath,
  title,
  description,
  notSafeForWork,
  editionCount = 1,
  royaltiesPercentage = 10,
}: UseMintNFT) => {
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);
  const { user } = useUser();
  let userAddress = user
    ? user.data.profile.wallet_addresses_excluding_email_v2[0].address
    : testAddress;
  console.log("user address ", userAddress);
  const connector = useWalletConnect();
  async function uploadFile() {
    if (userAddress) {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (typeof fileInfo.size === "number" && fileInfo.size > MAX_FILE_SIZE) {
        // TODO: improve alert
        Alert.alert("File too big! Please use a file smaller than 50MB.");
        return;
      }

      const fileMetaData = getFileNameAndType(filePath);

      if (fileMetaData) {
        const pinataToken = await getPinataToken(userAddress);

        const formData = new FormData();

        formData.append("file", {
          uri: filePath,
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

        console.log("File uploaed!! ", fileIpfsHash);

        if (fileIpfsHash) {
          const pinataToken = await getPinataToken(userAddress);

          const nftJson = await axios
            .post(
              "https://api.pinata.cloud/pinning/pinJSONToIPFS",
              {
                pinataMetadata: { name: uuid() },
                pinataContent: {
                  name: title,
                  description,
                  image: `ipfs://${fileIpfsHash}`,
                  ...(notSafeForWork
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

          console.log("NFT JSON uploaded ", nftJson);

          return nftJson;
        }
      }
    }
  }

  async function mintToken(nftJsonIpfsHash: string) {
    const { biconomy, web3 } = await getBiconomy(connector);

    // const signerAddress = await web3.getSigner().getAddress();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MINTING_CONTRACT,
      minterAbi,
      biconomy.getSignerByAddress(userAddress)
    );

    const { data } = await contract.populateTransaction.issueToken(
      userAddress,
      editionCount,
      nftJsonIpfsHash,
      0,
      userAddress,
      royaltiesPercentage * 100
    );
    const provider = biconomy.getEthersProvider();
    // connector.sendCustomRequest({
    //   batchId: 0,
    //   batchNonce: 0,
    //   data: "0x66250b430000000000000000000000003cfa5fe88512db62e40d0f91b7e59af34c1b098f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000003cfa5fe88512db62e40d0f91b7e59af34c1b098f00000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000002e516d5071506e47487771597861316d716e4d623244594141686354685577374e4e356447724a746775384232324e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
    //   deadline: 1642426871,
    //   from: "0x3CFa5Fe88512Db62e40d0F91b7E59af34C1b098f",
    //   to: "0x09f3a26302e1c45f0d78be5d592f52b6fca43811",
    //   token: "0x0000000000000000000000000000000000000000",
    //   tokenGasPrice: "0",
    //   txGas: 174897,
    // });

    // connector.sendTransaction({
    //   type: "EIP712_SIGN",
    //   data,
    //   from: userAddress,
    //   to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
    // });

    // if (connector.connected) {
    // const request = {
    //   types: {
    //     EIP712Domain: [
    //       { name: "name", type: "string" },
    //       { name: "version", type: "string" },
    //       { name: "verifyingContract", type: "address" },
    //       { name: "salt", type: "bytes32" },
    //     ],
    //     ERC20ForwardRequest: [
    //       { name: "from", type: "address" },
    //       { name: "to", type: "address" },
    //       { name: "token", type: "address" },
    //       { name: "txGas", type: "uint256" },
    //       { name: "tokenGasPrice", type: "uint256" },
    //       { name: "batchId", type: "uint256" },
    //       { name: "batchNonce", type: "uint256" },
    //       { name: "deadline", type: "uint256" },
    //       { name: "data", type: "bytes" },
    //     ],
    //   },
    //   domain: {
    //     name: "Biconomy Forwarder",
    //     version: "1",
    //     verifyingContract: "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b",
    //     salt: "0x0000000000000000000000000000000000000000000000000000000000013881",
    //   },
    //   primaryType: "ERC20ForwardRequest",
    //   message: {
    //     from: "0x3CFa5Fe88512Db62e40d0F91b7E59af34C1b098f",
    //     to: "0x09f3a26302e1c45f0d78be5d592f52b6fca43811",
    //     token: "0x0000000000000000000000000000000000000000",
    //     txGas: 174897,
    //     tokenGasPrice: "0",
    //     batchId: 0,
    //     batchNonce: 0,
    //     deadline: 1642429576,
    //     data: "0x66250b430000000000000000000000003cfa5fe88512db62e40d0f91b7e59af34c1b098f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000003cfa5fe88512db62e40d0f91b7e59af34c1b098f00000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000002e516d5071506e47487771597861316d716e4d623244594141686354685577374e4e356447724a746775384232324e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
    //   },
    // };

    // const msgParams = [
    //   userAddress, // Required
    //   request, // Required
    // ];

    // const res = await connector.signTypedData(msgParams);
    // }

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
          throw new Error("Something went wrong");
        }

        if (
          JSON.parse(
            error?.body || error?.error?.body || "{}"
          )?.error?.message?.includes("caller is not minter")
        ) {
          throw new Error("Your address is not approved for minting");
        }

        throw error;
      });

    console.log("transaction hash ", transaction);

    provider.once(transaction, (result: any) => {
      // setTokenID(
      //   contract.interface
      //     .decodeFunctionResult("issueToken", result.logs[0].data)[0]
      //     .toNumber()
      // );
      console.log(
        "token id! ",
        contract.interface
          .decodeFunctionResult("issueToken", result.logs[0].data)[0]
          .toNumber()
      );
      dispatch({ type: "mintingSuccess" });
      console.log();
    });
  }

  async function mintTokenPipeline() {
    let nftJsonHash = "QmPqPnGHwqYxa1mqnMb2DYAAhcThUw7NN5dGrJtgu8B22N";

    // try {
    //   dispatch({ type: "fileUpload" });
    //   const nftJsonHash = await uploadFile();
    // } catch (e) {
    //   console.error("File upload error", e);
    //   dispatch({ type: "fileUploadError" });
    //   return;
    // }

    if (nftJsonHash) {
      try {
        dispatch({ type: "minting" });
        await mintToken(nftJsonHash);
      } catch (e) {
        throw e;
        console.log("errror ", e);
        dispatch({ type: "mintingError" });
        return;
      }
    }
  }

  useEffect(() => {
    if (connector.connected) {
      mintTokenPipeline();
    }
  }, [connector]);

  console.log("state ", state);

  // return { data, loading: !data, error };
};
