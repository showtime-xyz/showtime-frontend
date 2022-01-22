import { View } from "design-system/view";
import { Text } from "design-system/text";
import { AvatarGroup } from "design-system/avatar-group";
import { Skeleton } from "design-system/skeleton";
import { useLikes } from "app/hooks/api/use-likes";
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
    <View tw="px-4 py-2 flex flex-row justify-start	items-center">
      <AvatarGroup
        count={Math.min(3, nft.like_count)}
        profiles={data?.likers}
      />
      <Text tw="ml-2 text-xs text-gray-600 font-semibold">Liked by&nbsp;</Text>
      <Skeleton
        show={loading}
        height={10}
        width={150}
        colorMode={isDarkMode ? "dark" : "light"}
      >
        {!loading ? (
          <Text tw="text-xs text-gray-600 font-semibold">
            {data?.likers.slice(0, 2).map((like, index) => (
              <>
                <Text tw="font-bold	text-black dark:text-white">
                  @{like.username}
                </Text>
                {index === 0 && data?.likers.length > 1 && <Text>,&nbsp;</Text>}
              </>
            ))}
            &nbsp;
            {(data?.likers.length ?? 0) > 2 && (
              <>
                <Text>&amp;&nbsp;</Text>
                <Text tw="font-bold	text-black dark:text-white">
                  {`${data?.likers.length ?? 0} others`}
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
