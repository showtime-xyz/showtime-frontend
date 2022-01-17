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
import { formatAddressShort } from "../utilities";

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
    | "mintingError";
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

const testAddress = "0x3CFa5Fe88512Db62e40d0F91b7E59af34C1b098f";

export const useMintNFT = ({
  filePath,
  title,
  description,
  notSafeForWork,
}: UseMintNFT) => {
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);
  const { user } = useUser();
  let userAddress = user ? user.publicAddress : testAddress;
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
        const pinataToken = await axios
          .post(
            "https://api.pinata.cloud/users/generateApiKey",
            {
              maxUses: 1,
              keyName: `${formatAddressShort(userAddress)}'s key`,
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

        const data = await axios
          .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              Authorization: `Bearer ${pinataToken}`,
              "Content-Type": `multipart/form-data`,
            },
          })
          .then((res) => res.data);

        console.log("uploaded!! ", data);

        return data;
      }
    }
  }

  async function mintToken(ipfsHash: string) {
    const pinataToken = await axios
      .post("/api/pinata/generate-key")
      .then((res) => res.data.token);

    const contentHash = await axios
      .post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataMetadata: { name: uuid() },
          pinataContent: {
            name: title,
            description,
            image: `ipfs://${ipfsHash}`,
            ...(notSafeForWork ? { attributes: [{ value: "NSFW" }] } : {}),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${pinataToken}`,
          },
        }
      )
      .then((res) => res.data.IpfsHash);
  }

  async function mintTokenPipeline(filePath: string) {
    let ipfsHash = "";
    try {
      dispatch({ type: "fileUpload" });
      ipfsHash = await uploadFile();
    } catch (e) {
      console.error("File upload error", e);
      dispatch({ type: "fileUploadError" });
      return;
    }

    if (ipfsHash) {
      try {
        dispatch({ type: "minting" });
        // await mintToken(ipfsHash);
      } catch (e) {
        dispatch({ type: "mintingError" });
        return;
      }
    }
  }

  useEffect(() => {
    mintTokenPipeline(filePath);
  }, []);

  console.log("state ", state);

  // return { data, loading: !data, error };
};
