import { Fragment } from "react";

import { Text } from "@showtime-xyz/universal.text";

import { useLikes } from "app/hooks/api/use-likes";
import { formatAddressShort } from "app/lib/utilities";
import { TextLink } from "app/navigation/link";

import { Skeleton } from "design-system/skeleton";
import { View } from "design-system/view";

import { useIsDarkMode } from "../hooks";

interface Props {
  nft?: any;
}

export function LikedBy({ nft }: Props) {
  //#region hooks
  const isDarkMode = useIsDarkMode();
  const { data, loading } = useLikes(nft?.nft_id);
  //#endregion

  if (!nft || nft.like_count === 0) return null;

  return (
    <View tw="flex flex-row items-center justify-start bg-white px-4 py-2	dark:bg-black">
      <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
        Liked by&nbsp;
      </Text>
      <Skeleton
        show={loading}
        height={10}
        width={150}
        colorMode={isDarkMode ? "dark" : "light"}
      >
        {!loading ? (
          <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {data?.likers.slice(0, 2).map((like, index) => (
              <Fragment key={`liked-by-user-${like.profile_id}`}>
                <TextLink
                  href={`/@${like.username ?? like.wallet_address}`}
                  tw="text-xs font-bold	text-black dark:text-white"
                >
                  {like.username ? (
                    <>@{like.username}</>
                  ) : (
                    <>{formatAddressShort(like.wallet_address)}</>
                  )}
                </TextLink>
                {index === 0 && data?.likers.length > 1 && (
                  <Text tw="text-xs">,&nbsp;</Text>
                )}
              </Fragment>
            ))}
            &nbsp;
            {(data?.likers.length ?? 0) > 2 && (
              <>
                <Text tw="text-xs">&amp;&nbsp;</Text>
                <Text tw="text-xs font-bold text-black dark:text-white">
                  {data?.likers
                    ? `${data.likers.length - 2} ${
                        data.likers.length - 2 === 1 ? "other" : "others"
                      }`
                    : 0}
                </Text>
              </>
            )}
          </Text>
        ) : (
          (null as any)
        )}
      </Skeleton>
    </View>
  );
}
