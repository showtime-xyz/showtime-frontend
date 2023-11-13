import { useMemo } from "react";
import { Platform } from "react-native";

import { BlurView } from "expo-blur";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  ChevronRight,
  GoldHexagon,
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
  CreatorTokenItem,
  CreatorTokenUser,
  NewCreatorTokenItem,
  TopCreatorTokenUser,
} from "app/hooks/creator-token/use-creator-tokens";
import { linkifyDescription } from "app/lib/linkify";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import {
  cleanUserTextInput,
  formatAddressShort,
  limitLineBreaks,
  removeTags,
} from "app/utilities";

import { generateLoremIpsum } from "../creator-channels/utils";
import { PlatformBuyButton } from "../profile/buy-and-sell-buttons";

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

export const TopCreatorTokenItemOnProfile = ({
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
  const token = (item as NewCreatorTokenItem)?.creator_token
    ? ((item as NewCreatorTokenItem).creator_token as CreatorTokenItem)
    : (item as CreatorTokenItem);
  return (
    <PressableHover
      tw={["mb-2 py-1.5", tw].join(" ")}
      onPress={() => {
        router.push(
          token?.owner_profile?.username
            ? `/@${token?.owner_profile?.username}`
            : `/@${token?.owner_address}`
        );
      }}
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
        <View tw="ml-1 flex-1 flex-row items-center">
          <Avatar url={token?.owner_profile?.img_url} size={34} />
          <View tw="ml-2 flex-1 justify-center">
            <View tw="flex-row items-center">
              <Text
                tw="text-sm font-semibold text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                @
                {token?.owner_profile?.username
                  ? token?.owner_profile?.username
                  : formatAddressShort(token?.owner_address)}
              </Text>
              {Boolean(token?.owner_profile?.verified) && (
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
                {token?.nft_count}
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
export const TopCreatorTokenListItem = ({
  index,
  tw,
  item,
  isSimplified = false,
  isMdWidth,
  ...rest
}: ViewProps & {
  index?: number;
  item: TopCreatorTokenUser;
  isSimplified?: boolean;
  isMdWidth?: boolean;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const token = (item as NewCreatorTokenItem)?.creator_token
    ? ((item as NewCreatorTokenItem).creator_token as CreatorTokenItem)
    : (item as CreatorTokenItem);
  const lastMessage = (item as NewCreatorTokenItem)?.last_channel_message;
  const loremText = useMemo(
    () =>
      lastMessage?.body_text_length > 0
        ? generateLoremIpsum(lastMessage?.body_text_length)
        : "",
    [lastMessage?.body_text_length]
  );
  const linkifiedMessage = useMemo(
    () =>
      lastMessage?.body
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(removeTags(lastMessage.body)),
              10
            ),
            "!text-indigo-600 dark:!text-blue-400"
          )
        : "",
    [lastMessage?.body]
  );

  return (
    <PressableHover
      tw={["flex-row py-2.5", tw].join(" ")}
      onPress={() => {
        router.push(
          token.owner_profile?.username
            ? `/@${token.owner_profile?.username}`
            : `/@${token.owner_address}`
        );
      }}
      {...rest}
    >
      <View tw="h-[34px] flex-row">
        <View tw="min-w-[26px] items-start self-center">
          {index != undefined ? (
            index < 3 ? (
              <View tw="items-center ">
                <View tw="absolute -top-1">
                  <GoldHexagon width={18} height={18} />
                </View>
                <Text tw="text-xs font-bold text-white">{index + 1}</Text>
              </View>
            ) : (
              <View tw="items-center ">
                <Text tw="text-xs font-bold text-gray-700 dark:text-white">
                  {index + 1}
                </Text>
              </View>
            )
          ) : null}
        </View>
        <Avatar url={token?.owner_profile?.img_url} size={34} />
      </View>
      <View tw="web:flex-1 ml-2 flex-row">
        <View tw="w-[168px] justify-center md:w-[180px]">
          <View tw="min-w-[180px] flex-row">
            <Text
              tw="max-w-[150px] text-sm font-semibold text-gray-900 dark:text-white"
              numberOfLines={1}
              style={{ lineHeight: 20 }}
            >
              @
              {token.owner_profile?.username
                ? token.owner_profile?.username
                : formatAddressShort(token.owner_address)}
            </Text>
            <View tw="h-1" />
            {Boolean(token.owner_profile?.verified) && (
              <View tw="ml-1">
                <VerificationBadge size={14} />
              </View>
            )}
          </View>
          {!isSimplified ? (
            <>
              <View tw="h-1.5" />
              <Text
                tw="text-xs text-gray-500 dark:text-gray-400"
                numberOfLines={2}
              >
                {token.owner_profile?.bio}
              </Text>
            </>
          ) : null}
        </View>
        <View tw="ml-4 min-w-[50px] flex-row items-center md:ml-6">
          <Text
            tw="text-sm font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {token.nft_count}
          </Text>
          <View tw="w-1" />
          <ShowtimeRounded
            width={16}
            height={16}
            color={isDark ? colors.white : colors.gray[900]}
          />
        </View>
        <View tw="ml-auto lg:ml-4">
          <PlatformBuyButton
            style={{ backgroundColor: "#08F6CC", height: 26 }}
            username={token.owner_profile?.username}
          />
        </View>
      </View>
      {!lastMessage ? null : (
        <View tw="ml-auto hidden w-full max-w-[200px] flex-row items-center justify-between lg:flex">
          {lastMessage.is_payment_gated ? (
            <View tw="select-none overflow-hidden px-2 py-0.5">
              {Platform.OS === "web" ? (
                // INFO: I had to do it like that because blur-sm would crash for no reason even with web prefix
                <View tw="max-w-[200px]  blur-sm">
                  <Text
                    tw="text-sm text-gray-900 dark:text-gray-100"
                    numberOfLines={2}
                  >
                    {loremText}
                  </Text>
                </View>
              ) : (
                <>
                  <Text tw="py-1.5 text-sm  text-gray-900 dark:text-gray-100">
                    {loremText}
                  </Text>
                  <BlurView
                    intensity={10}
                    style={{
                      left: 0,
                      height: "200%",
                      width: "200%",
                      position: "absolute",
                    }}
                  />
                </>
              )}
            </View>
          ) : (
            <>
              {lastMessage.body_text_length > 0 ? (
                <Text
                  tw={"text-sm text-gray-900 dark:text-gray-100"}
                  style={
                    Platform.OS === "web"
                      ? {
                          // @ts-ignore
                          wordBreak: "break-word",
                        }
                      : {}
                  }
                >
                  {linkifiedMessage}
                </Text>
              ) : null}
            </>
          )}
          <ChevronRight
            width={14}
            height={14}
            color={isDark ? colors.white : colors.gray[900]}
          />
        </View>
      )}
    </PressableHover>
  );
};

export const TopCreatorTokenSkeleton = ({ tw, ...rest }: ViewProps) => {
  return (
    <View tw={["mb-2 py-1.5", tw].join(" ")} {...rest}>
      <View tw="flex-row items-center pl-1">
        <Skeleton width={16} height={16} show radius={8} />
        <View tw="ml-2 flex-row items-center">
          <Skeleton width={34} height={34} show radius={999} />
          <View tw="w-2" />
          <View tw="">
            <Skeleton width={80} height={13} show radius={4} />
            <View tw="h-1" />
            <Skeleton width={60} height={13} show radius={4} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const TopCreatorTokenListItemSkeleton = ({
  tw,
  ...rest
}: ViewProps & {
  isMdWidth: boolean;
}) => {
  return (
    <View tw={["py-2.5", tw].join(" ")} {...rest}>
      <View tw="flex-row items-center pl-1">
        <Skeleton width={16} height={16} show radius={8} />
        <View tw="w-2.5" />
        <Skeleton width={34} height={34} show radius={999} />
        <View tw="ml-2 w-[178px] md:w-[214px]">
          <Skeleton width={140} height={13} show radius={4} />
        </View>
        <Skeleton width={30} height={14} show radius={4} />
        <View tw="ml-auto lg:ml-10">
          <Skeleton width={42} height={24} show radius={999} />
        </View>
        <View tw="hidden lg:ml-8 lg:flex">
          <Skeleton width={200} height={14} show radius={999} />
        </View>
      </View>
    </View>
  );
};
