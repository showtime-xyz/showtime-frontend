import { useMemo } from "react";
import { Platform } from "react-native";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { Switch } from "@showtime-xyz/universal.switch";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  useEditPushNotificationsPreferences,
  usePushNotificationsPreferences,
} from "app/hooks/use-push-notifications-preferences";

import { SettingsTitle } from "../settings-title";

const ScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type PushNotificationKey =
  | "channel_first_message"
  | "channel_new_message"
  | "claimed_creator_airdrop_from_following"
  | "comment_mention"
  | "comment_on_created_nft"
  | "comment_on_owned_nft"
  | "created_edition_expired"
  | "created_edition_sold_out"
  | "follow"
  | "like_on_comment"
  | "like_on_created_nft"
  | "like_on_owned_nft"
  | "new_creator_airdrop_from_following"
  | "nft_sale"
  | "release_saved_to_spotify";

type GroupKey = "Drop" | "Creator Channel" | "Social Interactions";
type GroupValue = Array<PushNotificationKey>;

type NotificationGroups = Record<GroupKey, GroupValue> &
  Partial<Record<"Others", GroupValue>>;

const notificationMapping = {
  channel_first_message: {
    title: "New Channel Message",
    description:
      "When the first message is posted in a new channel you’ve joined.",
  },
  channel_new_message: {
    title: "New Channel Message",
    description: "When a new message is posted in a channel you are part of.",
  },
  claimed_creator_airdrop_from_following: {
    title: "New Drop from Creators You Follow",
    description:
      "When a creator you’re following has a new airdrop that you’ve collected.",
  },
  comment_mention: {
    title: "New Mention In Your Drop Comments",
    description: "When someone mentions you in a comment.",
  },
  comment_on_created_nft: {
    title: "New Comment from Your Drop",
    description: "When someone comments on one of your drops.",
  },
  comment_on_owned_nft: {
    title: "New Comment from Drops You Collected",
    description: "When someone comments on a drop that you collected.",
  },
  created_edition_expired: {
    title: "Your Drop Expired",
    description:
      "When the sale period for a drop you’ve created has expired without all copies being sold.",
  },
  created_edition_sold_out: {
    title: "Your Drop Sold Out",
    description: "When all copies of a drop you’ve created have been sold.",
  },
  follow: {
    title: "New Follow",
    description: "When a user starts following you.",
  },
  like_on_comment: {
    title: "New Comment Likes",
    description: "When someone likes your comment.",
  },
  like_on_created_nft: {
    title: "Like on Your Drop",
    description: "When someone likes one of your drops.",
  },
  like_on_owned_nft: {
    title: "Like on Drops You Collected",
    description: "When someone likes a drop that you collected.",
  },
  new_creator_airdrop_from_following: {
    title: "New Creator Airdrop",
    description: "When a new creator airdrop is available.",
  },
  nft_sale: {
    title: "NFT Sale",
    description: "When an NFT is sold.",
  },
  release_saved_to_spotify: {
    title: "Release Saved to Spotify",
    description: "When a release is saved to Spotify.",
  },
};

const nGroups: NotificationGroups = {
  Drop: [
    "claimed_creator_airdrop_from_following",
    "created_edition_expired",
    "created_edition_sold_out",
    "new_creator_airdrop_from_following",
  ],
  "Creator Channel": ["channel_first_message", "channel_new_message"],
  "Social Interactions": [
    "comment_mention",
    "comment_on_created_nft",
    "comment_on_owned_nft",
    "follow",
    "like_on_comment",
    "like_on_created_nft",
    "like_on_owned_nft",
  ],
};

export type PushNotificationTabProp = {
  index?: number;
};

export const PushNotificationTab = ({ index = 0 }: PushNotificationTabProp) => {
  const { data, isLoading } = usePushNotificationsPreferences();
  const { trigger } = useEditPushNotificationsPreferences();

  const validatedData = useMemo(() => {
    if (!data) return {};

    return Object.keys(data).reduce((result, key) => {
      if (
        (Object.keys(notificationMapping) as PushNotificationKey[]).includes(
          key as PushNotificationKey
        )
      ) {
        result[key as PushNotificationKey] = data[key];
      }
      return result;
    }, {} as Record<PushNotificationKey, boolean>);
  }, [data]);

  const allGroupKeys = useMemo(() => Object.values(nGroups).flat(), []);
  const otherKeys = useMemo(() => {
    return (Object.keys(validatedData) as PushNotificationKey[]).filter(
      (key) => !allGroupKeys.includes(key)
    );
  }, [validatedData, allGroupKeys]);

  // Only update the groups if data has changed
  const notificationGroups = useMemo(
    () => ({ ...nGroups, Others: otherKeys }),
    [otherKeys]
  );

  if (isLoading || !data) {
    return (
      <View tw="animate-fade-in-250 h-28 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  return (
    <ScrollComponent index={index}>
      <SettingsTitle
        title="Push Notifications"
        desc="Manage your app notifications."
        descTw="mt-1"
      />
      <View tw="mt-4 px-4 md:mt-4 md:px-0">
        {Object.entries(notificationGroups).map(([group, keys], index) => (
          <View key={group}>
            <View tw={index === 0 ? "mb-4 mt-2" : "my-4"}>
              <Text tw="text-lg font-bold dark:text-white">{group}</Text>
            </View>
            {keys.map((key, index) => {
              const value = data[key];
              const keyAsNotificationKey = key as PushNotificationKey;
              return (
                <View tw="flex-row items-start py-4" key={index.toString()}>
                  <Switch
                    size="small"
                    checked={value as boolean}
                    onChange={async () => {
                      trigger(
                        { pushKey: [keyAsNotificationKey], pushValue: !value },
                        {
                          optimisticData: (current: any) => ({
                            ...current,
                            [keyAsNotificationKey]: !value,
                          }),
                          revalidate: false,
                        }
                      );
                    }}
                  />
                  <View tw="ml-2 flex-1 md:ml-4">
                    <View>
                      <Text tw="text-base font-medium text-gray-900 dark:text-white">
                        {notificationMapping[keyAsNotificationKey]?.title}
                      </Text>
                    </View>
                    <View tw="mt-2.5">
                      <Text tw="text-sm text-gray-500 dark:text-gray-300">
                        {notificationMapping[keyAsNotificationKey]?.description}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollComponent>
  );
};
