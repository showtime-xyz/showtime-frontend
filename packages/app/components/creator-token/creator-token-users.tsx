import { Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  GoldHexagon,
  Showtime,
  ShowtimeRounded,
} from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import {
  CreatorTokenUser,
  TopCreatorTokenUser,
} from "app/hooks/creator-token/use-creator-tokens";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { formatAddressShort } from "app/utilities";

export const CreatorTokensTitle = ({ title }: { title: string }) => {
  const headerHeight = useHeaderHeight();
  return (
    <View tw="mb-4">
      <View
        style={{
          height: Platform.select({
            ios: headerHeight + 8,
            default: 8,
          }),
        }}
      />
      <View tw="hidden flex-row justify-between bg-white pb-4 dark:bg-black md:flex">
        <Text tw="font-bold text-gray-900 dark:text-white md:text-xl">
          {title}
        </Text>
      </View>
    </View>
  );
};
export const CreatorTokenCard = ({
  index,
  tw,
  item,
  ...rest
}: ViewProps & { index: number; item: CreatorTokenUser }) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  return (
    <PressableHover
      tw={[
        "mb-3 items-center rounded-md border border-gray-200 bg-slate-50 px-1 py-4 dark:border-gray-700 dark:bg-gray-900",
        tw,
      ].join(" ")}
      onPress={() => router.push(`/@${item.username}`)}
      {...rest}
    >
      <>
        <View tw="mb-3">
          <View tw="absolute -left-1 top-0">
            <Showtime
              width={8}
              height={8}
              color={isDark ? colors.white : colors.gray[900]}
            />
          </View>
          <Avatar url={item?.img_url} size={44} />
        </View>
        <Text
          tw="px-1 text-sm font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          @{item?.username}
        </Text>
        {/* <View tw="h-3" />
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">$2.60</Text> */}
      </>
      {/* <View tw="absolute -right-2.5 -top-2.5 h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-500 px-1.5 text-gray-500 dark:bg-gray-600">
        <Text tw="text-xs font-semibold text-white">{index + 1}</Text>
      </View> */}
    </PressableHover>
  );
};

export const TopCreatorTokenListItem = ({
  index,
  tw,
  item,
  showName = false,
  ...rest
}: ViewProps & {
  index?: number;
  item: CreatorTokenUser;
  showName?: boolean;
}) => {
  const router = useRouter();
  return (
    <PressableHover
      tw={["py-1.5", tw].join(" ")}
      onPress={() => router.push(`/@${item.username}`)}
      {...rest}
    >
      <View tw="flex-row items-center">
        {index != undefined ? (
          index < 3 ? (
            <View tw="mr-1 items-center justify-center">
              <View tw="absolute -top-1">
                <GoldHexagon width={18} height={18} />
              </View>
              <Text tw="text-xs font-bold text-white">{index + 1}</Text>
            </View>
          ) : (
            <View tw="mr-1 items-center justify-center">
              <Text tw="text-xs font-bold text-gray-700 dark:text-white">
                {index + 1}
              </Text>
            </View>
          )
        ) : null}
        <View tw="web:flex-1 ml-2 flex-row items-center">
          <Avatar url={item?.img_url} size={34} />
          <View tw="w-2" />
          {showName ? (
            <View tw="flex-1 justify-center">
              {item.name ? (
                <>
                  <Text
                    tw="text-sm font-semibold text-gray-600 dark:text-gray-300"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View tw="h-1" />
                </>
              ) : null}

              <View tw="flex-row items-center">
                <Text
                  tw="text-sm font-semibold text-gray-900 dark:text-white"
                  numberOfLines={1}
                >
                  {item.username ? (
                    <>@{item.username}</>
                  ) : (
                    <>{formatAddressShort(item.wallet_address)}</>
                  )}
                </Text>
                {Boolean(item.verified) && (
                  <View tw="ml-1">
                    <VerificationBadge size={14} />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Text
              tw="flex-1 text-sm font-semibold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              @{item?.username}
            </Text>
          )}
        </View>
      </View>
    </PressableHover>
  );
};
export const TopCreatorTokenItem = ({
  index,
  tw,
  item,
  ...rest
}: ViewProps & {
  index?: number;
  item: TopCreatorTokenUser;
}) => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  return (
    <PressableHover
      tw={["py-1.5", tw].join(" ")}
      onPress={() => router.push(`/@${item.owner_profile.username}`)}
      {...rest}
    >
      <View tw="flex-row items-center">
        <View tw="min-w-[24px]">
          {index != undefined ? (
            index < 3 ? (
              <View tw="items-center justify-center">
                <View tw="absolute -top-1">
                  <GoldHexagon width={18} height={18} />
                </View>
                <Text tw="text-xs font-bold text-white">{index + 1}</Text>
              </View>
            ) : (
              <View tw="items-center justify-center">
                <Text tw="text-xs font-bold text-gray-700 dark:text-white">
                  {index + 1}
                </Text>
              </View>
            )
          ) : null}
        </View>
        <View tw="web:flex-1 ml-2 flex-row items-center">
          <Avatar url={item?.owner_profile?.img_url} size={34} />
          <View tw="w-2" />
          <View tw="flex-1 justify-center">
            <View tw="flex-row items-center">
              {item?.owner_profile?.username ? (
                <>
                  <Text
                    tw="text-sm font-semibold text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    @{item.owner_profile.username}
                  </Text>
                  <View tw="h-1" />
                </>
              ) : null}
              {Boolean(item.owner_profile?.verified) && (
                <View tw="ml-1">
                  <VerificationBadge size={14} />
                </View>
              )}
            </View>
            <View tw="mt-1 flex-row items-center">
              <Text
                tw="text-xs font-semibold text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {item.nft_count}
              </Text>
              <View tw="w-1" />
              <ShowtimeRounded
                width={14}
                height={14}
                color={isDark ? colors.white : colors.gray[900]}
              />
            </View>
          </View>
        </View>
      </View>
    </PressableHover>
  );
};

export const TopCreatorTokenSkeleton = ({ tw, ...rest }: ViewProps) => {
  return (
    <View tw={["py-1.5", tw].join(" ")} {...rest}>
      <View tw="flex-row items-center pl-1">
        <Skeleton width={16} height={16} show radius={8} />
        <View tw="ml-2 flex-row items-center">
          <Skeleton width={34} height={34} show radius={999} />
          <View tw="w-2" />
          <View tw="">
            <Skeleton width={100} height={13} show radius={4} />
            <View tw="h-1" />
            <Skeleton width={80} height={13} show radius={4} />
          </View>
        </View>
      </View>
    </View>
  );
};
