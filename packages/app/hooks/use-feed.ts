import useSWR from "swr";

import { useAuth } from "app/hooks/auth/use-auth";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { NFT } from "app/types";

type FeedAPIResponse = Array<NFT>;

// type FeedType = "/following" | "/curated" | "";

const useFeed = () => {
  const { accessToken } = useAuth();
  const { data, isLoading, mutate, error } = useSWR<FeedAPIResponse>(
    accessToken ? "/v4/feed/nfts" : "/v2/trending/nfts?timeframe=day",
    fetcher,
    { revalidateOnFocus: false }
  );

  return { data: data ?? [], isLoading, mutate, error };
};

export { useFeed };

// export const useFeed = (type: FeedType) => {
//   const { accessToken } = useAuth();

//   const feedUrlFn = useCallback(
//     (index: number) => {
//       const url = `/v3/feed${accessToken ? type : "/curated"}?offset=${
//         index + 1
//       }&limit=5`;
//       return url;
//     },
//     [accessToken, type]
//   );

//   const queryState = useInfiniteListQuerySWR<FeedAPIResponse>(feedUrlFn);

//   const newData = useMemo(() => {
//     let newData: NFT[] = [];
//     if (queryState.data) {
//       queryState.data.forEach((p) => {
//         // filter if duplicate data shows up in pagingation.
//         // It can happen if database is updating and we are fetching new data.
//         // As new post shows on top, fetching next page can have same post as previous page.
//         // TODO: Cursor based pagination in API?
//         const uniquePage = p.filter((d) => {
//           const found = newData.find((n) => n.nft_id === d.nft_id);
//           if (found) {
//             return false;
//           }
//           return true;
//         });

//         newData = newData.concat(uniquePage);
//       });
//     }

//     if (newData.length > 0) {
//       const imagesUrl = newData
//         .map((nft) =>
//           // Note that we don't preload still previews for videos or gifs
//           // because videos are not using `react-native-fast-image`
//           nft.mime_type?.startsWith("image") && nft.mime_type !== "image/gif"
//             ? getMediaUrl({ nft, stillPreview: false })
//             : null
//         )
//         .filter((url) => url !== null);

//       if (imagesUrl.length > 0) {
//         preload(imagesUrl as string[]);
//       }
//     }
//     return newData;
//   }, [queryState.data]);

//   const updateItem = (updatedItem: NFT) => {
//     queryState.mutate((pages) => {
//       return pages?.map((page) => {
//         return page.map((item) => {
//           if (item.nft_id === updatedItem.nft_id) {
//             return updatedItem;
//           }

//           return item;
//         });
//       });
//     });
//   };

//   return { ...queryState, updateItem, data: newData };
// };
