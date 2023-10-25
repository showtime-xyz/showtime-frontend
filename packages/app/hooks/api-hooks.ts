import { useCallback, useMemo } from "react";

import useSWR from "swr";

import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { useLogInPromise } from "app/lib/login-promise";
import { MyInfo, NFT, Profile } from "app/types";

import { useAuth } from "./auth/use-auth";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const { accessToken } = useAuth();

  const activityURLFn = useCallback(
    (index: number) => {
      const url = `/v2/${
        accessToken ? "activity_with_auth" : "activity_without_auth"
      }?page=${index + 1}&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit, accessToken]
  );

  const queryState = useInfiniteListQuerySWR<any>(activityURLFn, {
    pageSize: limit,
  });

  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      // filter if duplicate data shows up in pagingation. Flatlist starts acting weird on receiving duplicates
      // It can happen if database is updating and we are fetching new data.
      // As new post shows on top, fetching next page can have same post as previous page.
      // TODO: Cursor based pagination in API?
      queryState.data.forEach((page) => {
        if (page) {
          page.data = page.data.filter((d: any) => {
            const v = newData.find((x: any) => x.id === d.id);
            if (v === undefined) {
              return true;
            }
            if (__DEV__) {
              console.log("duplicate record in feed ", d.id);
            }
            return false;
          });
          newData = newData.concat(page.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

export const useTrendingCreators = ({ days }: { days: number }) => {
  const PAGE_SIZE = 15;
  const trendingCreatorsUrlFn = useCallback(
    (index: number) => {
      const url = `/v1/leaderboard?page=${
        index + 1
      }&days=${days}&limit=${PAGE_SIZE}`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn, {
    pageSize: PAGE_SIZE,
  });
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

export const useTrendingNFTS = ({
  filter,
  pageSize,
}: {
  filter?: string;
  pageSize?: number;
}) => {
  const trendingUrlFn = useCallback(() => {
    if (filter === "music") {
      return `/v3/trending/nfts/music?limit=${pageSize}`;
    }
    return `/v3/trending/nfts/all?limit=${pageSize}`;
  }, [filter, pageSize]);

  const { data, isLoading, error, mutate } = useSWR<NFT[]>(
    trendingUrlFn,
    fetcher,
    {
      revalidateIfStale: false,
      focusThrottleInterval: 20000,
      dedupingInterval: 20000,
    }
  );
  const newData = useMemo(() => {
    if (pageSize) {
      return data?.slice(0, pageSize) ?? [];
    }
    return data ?? [];
  }, [data, pageSize]);

  return {
    data: newData,
    isLoading,
    error,
    mutate,
  };
};

export const USER_PROFILE_KEY = "/v4/profile_server/";
export const useUserProfile = ({ address }: { address?: string | null }) => {
  const queryKey = address ? USER_PROFILE_KEY + address : null;
  const { data, error, isLoading, mutate } = useSWR<{
    data?: UserProfile;
  }>(queryKey, fetcher, {
    revalidateIfStale: false,
    focusThrottleInterval: 20000,
  });

  const { data: myInfoData } = useMyInfo();
  // if it's current user's profile, we get the profile from my info cache to make mutation easier, e.g. mutating username
  const userProfile: typeof data = useMemo(() => {
    if (
      data?.data &&
      myInfoData?.data?.profile.profile_id === data?.data?.profile.profile_id
    ) {
      return {
        data: {
          ...data.data,
          profile: {
            // merging is required, because myinfo is not returning all the fields
            ...data.data.profile,
            ...myInfoData.data.profile,
          },
        },
      };
    } else {
      return data;
    }
  }, [myInfoData?.data, data]);

  return {
    data: userProfile,
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
};

export interface UserProfile {
  profile: Profile;
  following_count: number;
  followers_count: number;
  featured_nft: NFT;
  follows_you: boolean;
  following_creator_drops: boolean;
}

type UserProfileNFTs = {
  profileId?: number;
  tabType?: string;
  sortType?: string;
  collectionId?: number;
  refreshInterval?: number;
};

type UseProfileNFTs = {
  items: Array<NFT>;
  has_more: boolean;
};

export const defaultFilters = {
  collectionId: 0,
  sortType: "newest",
};

export const PROFILE_NFTS_QUERY_KEY = "v2/profile-tabs/nfts";

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const PAGE_SIZE = 15;
  const {
    profileId,
    tabType: type,
    sortType = defaultFilters.sortType,
    collectionId = defaultFilters.collectionId,
    refreshInterval,
  } = params;
  const tabType = type === "tokens" ? null : type;

  const profileUrlFn = useCallback(
    (index: number) => {
      const url = `${PROFILE_NFTS_QUERY_KEY}?profile_id=${profileId}&page=${
        index + 1
      }&limit=${PAGE_SIZE}&tab_type=${tabType}&sort_type=${sortType}&collection_id=${collectionId}`;
      return url;
    },
    [profileId, tabType, sortType, collectionId]
  );

  const { mutate, ...queryState } = useInfiniteListQuerySWR<UseProfileNFTs>(
    params?.profileId && tabType ? profileUrlFn : () => null,
    { refreshInterval, pageSize: PAGE_SIZE }
  );

  const newData = useMemo(() => {
    let newData: NFT[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.items);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const fetchMore = () => {
    if (queryState.data?.[queryState.data.length - 1].has_more) {
      queryState.fetchMore();
    }
  };

  const updateItem = useCallback(
    (updatedItem: NFT) => {
      mutate((d) => {
        const updatedData = d?.map((d) => {
          return {
            ...d,
            items: d.items.map((item: NFT) => {
              if (item.nft_id === updatedItem.nft_id) {
                return updatedItem;
              }
              return item;
            }),
          };
        });
        return updatedData;
      });
    },
    [mutate]
  );

  return { ...queryState, fetchMore, updateItem, data: newData };
};
export const useProfileHideNFTs = (profileId?: number) => {
  const PAGE_SIZE = 100;
  const url = `${PROFILE_NFTS_QUERY_KEY}?profile_id=${profileId}&page=1&limit=${PAGE_SIZE}&tab_type=hidden`;

  const queryState = useSWR<UseProfileNFTs>(url, fetcher);

  return { ...queryState };
};
export type Collection = {
  collection_id: number;
  collection_name: string;
  collection_img_url: string;
  count?: number;
};

export type List = {
  collections?: Array<Collection>;
  displayed_count: number;
  has_custom_sort?: boolean;
  name: string;
  sort_type?: string;
  type: string;
  user_has_hidden_items?: boolean;
};

export type ProfileTabsAPI = {
  default_tab_type: string;
  tabs: Array<List>;
};

export const useProfileNftTabs = ({ profileId }: { profileId?: number }) => {
  // const { data, error, isLoading } = useSWR<ProfileTabsAPI>(
  //   profileId ? "/v2/profile-tabs/tabs?profile_id=" + profileId : null,
  //   fetcher
  // );
  // const songsCount = useMemo(() => {
  //   return (
  //     data?.tabs.find((item) => item.type === "created")?.displayed_count || 0
  //   );
  // }, [data?.tabs]);
  // const savedCount = useMemo(() => {
  //   return (
  //     data?.tabs.find((item) => item.type === "owned")?.displayed_count || 0
  //   );
  // }, [data?.tabs]);
  return {
    data: {
      default_tab_type: "tokens",
      tabs: [
        {
          type: "tokens",
          name: "Tokens",
          displayed_count: 0,
        },
        {
          type: "song_drops_created",
          name: "Songs",
          displayed_count: 0,
        },
        {
          type: "song_drops_collected",
          name: "Saved",
          displayed_count: 0,
        },
      ],
    },
    isLoading: false,
    error: null,
  };
};

export const useMyInfo = () => {
  const { accessToken } = useAuth();
  const { loginPromise } = useLogInPromise();
  const { data, error, mutate } = useSWR<MyInfo>(
    accessToken ? "/v2/myinfo" : null,
    fetcher,
    {
      revalidateOnMount: false,
      revalidateIfStale: false,
      dedupingInterval: 5000,
      focusThrottleInterval: 30000,
    }
  );

  const follow = useCallback(
    async (profileId: number | undefined) => {
      await loginPromise();

      if (data && profileId) {
        mutate(
          {
            data: {
              ...data.data,
              follows: [...data.data.follows, { profile_id: profileId }],
            },
          },
          false
        );
      }

      try {
        await axios({
          url: `/v2/follow/${profileId}`,
          method: "POST",
          data: {},
        });
        Analytics.track(EVENTS.USER_FOLLOWED_PROFILE);
      } catch (err) {
        console.error(err);
      }

      mutate();
    },
    [data, mutate, loginPromise]
  );

  const mutateLastCollectedStarDropCache = useCallback(
    async (params: {
      contractAddress: string;
      username: string;
      slug: string;
    }) => {
      if (data) {
        await mutate(
          {
            data: {
              ...data.data,
              profile: {
                ...data.data.profile,
                latest_star_drop_collected: {
                  contract_address: params.contractAddress,
                  username: params.username,
                  slug: params.slug,
                },
              },
            },
          },
          { revalidate: false }
        );
      }
    },
    [data, mutate]
  );

  const unfollow = useCallback(
    async (profileId?: number) => {
      if (data) {
        mutate(
          {
            data: {
              ...data.data,
              follows: data.data.follows.filter(
                (follow) => follow.profile_id !== profileId
              ),
            },
          },
          false
        );

        try {
          await axios({
            url: `/v2/unfollow/${profileId}`,
            method: "POST",
            data: {},
          });
          Analytics.track(EVENTS.USER_UNFOLLOWED_PROFILE);
        } catch (err) {
          console.error(err);
        }

        mutate();
      }
    },
    [data, mutate]
  );

  const isFollowing = useCallback(
    (userId: number) => {
      return Boolean(
        data?.data?.follows?.find((follow) => follow.profile_id === userId)
      );
    },
    [data]
  );

  const like = useCallback(
    async (nftId: number) => {
      await loginPromise();

      if (data) {
        mutate(
          {
            data: {
              ...data.data,
              likes_nft: [...data.data.likes_nft, nftId],
            },
          },
          false
        );
      }

      try {
        await axios({
          url: `/v3/like/${nftId}`,
          method: "POST",
          data: {},
        });
        Analytics.track(EVENTS.USER_LIKED_DROP);

        mutate();

        return true;
      } catch (error) {
        mutate();
        return false;
      }
    },
    [data, mutate, loginPromise]
  );

  const unlike = useCallback(
    async (nftId: number) => {
      if (data) {
        try {
          mutate(
            {
              data: {
                ...data.data,
                likes_nft: data.data.likes_nft.filter((id) => id !== nftId),
              },
            },
            false
          );

          await axios({
            url: `/v3/unlike/${nftId}`,
            method: "POST",
            data: {},
          });
          Analytics.track(EVENTS.USER_UNLIKED_DROP);

          mutate();
          return true;
        } catch (error) {
          mutate();
          return false;
        }
      }
    },
    [data, mutate]
  );

  const isLiked = useCallback(
    (nftId: number) => {
      return data?.data?.likes_nft?.includes(nftId);
    },
    [data]
  );

  const refetchMyInfo = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    data,
    loading: !data,
    error,
    follow,
    unfollow,
    isFollowing,
    like,
    unlike,
    isLiked,
    refetchMyInfo,
    mutateLastCollectedStarDropCache,
    mutate,
  };
};
