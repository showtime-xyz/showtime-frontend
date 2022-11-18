import { Fragment } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useLikes } from "app/hooks/api/use-likes";
import { TextLink } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

interface Props {
  nft?: any;
  max?: number;
  tw?: string;
}

export function LikedBy({ nft, max = 2, tw = "" }: Props) {
  //#region hooks
  const { data } = useLikes(nft?.nft_id);
  const router = useRouter();
  //#endregion

  if (!nft || nft.like_count === 0 || !data || data?.likers?.length === 0) {
    return null;
  }

  return (
    <View
      tw={[
        "flex flex-row items-center justify-start bg-white	dark:bg-black",
        tw,
      ]}
    >
      <Text tw="text-sm text-gray-900 dark:text-white">Liked by&nbsp;</Text>
      <Text tw="text-sm text-gray-900 dark:text-white">
        {data?.likers.slice(0, max).map((like, index) => (
          <Fragment key={`liked-by-user-${like.profile_id}`}>
            <TextLink
              href={`/@${like.username ?? like.wallet_address}`}
              tw="text-sm font-bold	text-black dark:text-white"
            >
              {like.username ? (
                <>@{like.username}</>
              ) : (
                <>{formatAddressShort(like.wallet_address)}</>
              )}
            </TextLink>
            {index === 0 && data?.likers.length > 1 && max > 1 && (
              <Text tw="text-sm">{`, `}</Text>
            )}
          </Fragment>
        ))}
        {` `}
        {(data?.likers.length ?? 0) > 2 && (
          <Text
            onPress={() => {
              const as = `/likers/${nft?.nft_id}`;
              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      nftId: nft?.nft_id,
                      likersModal: true,
                    },
                  } as any,
                }),
                Platform.select({
                  native: as,
                  web: router.asPath,
                }),
                { shallow: true }
              );
            }}
          >
            <Text tw="text-sm">{`& `}</Text>
            <Text tw="text-sm font-bold text-black dark:text-white">
              {data?.likers
                ? `${data.likers.length - 2} ${
                    data.likers.length - 2 === 1 ? "other" : "others"
                  }`
                : 0}
            </Text>
          </Text>
        )}
      </Text>
    </View>
  );
}
