import { Fragment } from "react";

import { useLikes } from "app/hooks/api/use-likes";
import { formatAddressShort } from "app/lib/utilities";
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import { Skeleton } from "design-system/skeleton";
import { Text } from "design-system/text";
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
    <View tw="bg-white dark:bg-black px-4 py-2 flex flex-row justify-start	items-center">
      <Text
        variant="text-xs"
        tw="text-gray-600 dark:text-gray-400 font-semibold"
      >
        Liked by&nbsp;
      </Text>
      <Skeleton
        show={loading}
        height={10}
        width={150}
        colorMode={isDarkMode ? "dark" : "light"}
      >
        {!loading ? (
          <Text
            variant="text-xs"
            tw="text-gray-600 dark:text-gray-400 font-semibold"
          >
            {data?.likers.slice(0, 2).map((like, index) => (
              <Fragment key={`liked-by-user-${like.profile_id}`}>
                <TextLink
                  variant="text-xs"
                  href={`/@${like.username ?? like.wallet_address}`}
                  tw="font-bold	text-black dark:text-white"
                >
                  {like.username ? (
                    <>@{like.username}</>
                  ) : (
                    <>{formatAddressShort(like.wallet_address)}</>
                  )}
                </TextLink>
                {index === 0 && data?.likers.length > 1 && (
                  <Text variant="text-xs">,&nbsp;</Text>
                )}
              </Fragment>
            ))}
            &nbsp;
            {(data?.likers.length ?? 0) > 2 && (
              <>
                <Text variant="text-xs">&amp;&nbsp;</Text>
                <Text
                  variant="text-xs"
                  tw="font-bold text-black dark:text-white"
                >
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
