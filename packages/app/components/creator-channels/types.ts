import type { FlashList } from "@shopify/flash-list";

import { InfiniteScrollListProps } from "@showtime-xyz/universal.infinite-scroll-list";

import { ChannelMessageItem } from "./hooks/use-channel-messages";
import { ChannelReactionResponse } from "./hooks/use-channel-reactions";
import { AnimatedInfiniteScrollList } from "./messages";

export type MessageItemProps = {
  item: ChannelMessageItem;
  reactions: ChannelReactionResponse;
  channelId: string;
};

export type HeaderProps = {
  username: string;
  members: number;
  channelId: string;
  onPressSettings: () => void;
  onPressShare: () => void;
};

export type CreatorChannelsListProps = {
  item: CreatorChannelsListItemProps;
  index: number;
};

export type ChannelProfile = {
  username: string;
  verified: boolean;
  profile_id: number;
  name: string;
  wallet_address: string;
  wallet_address_nonens: string;
  img_url: string;
  bio: string | null;
};

export type CreatorChannelsListItemProps = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  latest_message: {
    id: number;
    body: string;
    created_at: string;
    updated_at: string;
    profile: ChannelProfile;
    sent_by: {
      id: number;
      admin: boolean;
      created_at: string;
      updated_at: string;
      profile: ChannelProfile;
    };
  };
  unread: boolean;
  owner: ChannelProfile;
  member_count: number;
  itemType?: "creator" | "owned";
  // TODO: Add more props
} & { type: "section"; title: string; subtext?: string; tw?: string };

export type AnimatedInfiniteScrollListType = typeof AnimatedInfiniteScrollList;

export interface IAnimatedInfiniteScrollListWithRef
  extends AnimatedInfiniteScrollListType {
  (
    props: InfiniteScrollListProps<ChannelMessageItem> & {
      ref?: React.Ref<FlashList<MessageItemProps>>;
    }
  ): React.ReactElement | null;
}
