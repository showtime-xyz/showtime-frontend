import {
  FlashList,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";

import { Profile } from "app/types";

import { AnimatedInfiniteScrollList } from "./components/animated-cell-container";
import { ChannelReactionResponse } from "./hooks/use-channel-reactions";

export type BaseAttachment = {
  description: string;
  media_upload: string;
  mime: string;
  size: number;
  url: string;
  duration?: number;
};

export type ImageAttachment = BaseAttachment & {
  mime:
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "image/jpg"
    | "image/avif";
  height: number;
  width: number;
};

export type NonImageAttachment = BaseAttachment & {
  height?: null;
  width?: null;
  duration?: number | null;
};

export type ChannelMessageAttachment = ImageAttachment | NonImageAttachment;

export type ChannelMessage = {
  body: string;
  body_text_length: number;
  created_at: string;
  updated_at: string;
  id: number;
  is_payment_gated?: boolean;
  sent_by: {
    admin: boolean;
    created_at: string;
    id: number;
    profile: Profile;
  };
  attachments: ChannelMessageAttachment[];
};

export type ReactionGroup = {
  count: number;
  reaction_id: number;
  self_reacted: boolean;
};

export type ChannelMessageItem = {
  channel_message: ChannelMessage;
  reaction_group: ReactionGroup[];
};

export type ChannelMessageResponse = Array<ChannelMessageItem>;

export type ChannelLatestMessage = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  profile: ChannelProfile;
  is_payment_gated?: boolean;
  sent_by: {
    id: number;
    admin: boolean;
    created_at: string;
    updated_at: string;
    profile: ChannelProfile;
  };
  attachments: ChannelMessageAttachment[];
};

export type MessageItemProps = {
  item: ChannelMessageItem;
  reactions: ChannelReactionResponse;
  channelId: string;
  setEditMessage: (v: undefined | { id: number; text: string }) => void;
};

export type HeaderProps = {
  title?: string;
  username?: string;
  members?: number;
  channelId?: string;
  picture?: string;
  onPressSettings?: () => void;
  onPressShare?: () => void;
  isCurrentUserOwner?: boolean;
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
  latest_message: ChannelLatestMessage | null;
  read: boolean;
  owner: ChannelProfile;
  member_count: number;
  itemType?: "creator" | "owned";
  // TODO: Add more props
} & { type: "section"; title: string; subtext?: string; tw?: string };

export type AnimatedInfiniteScrollListType = typeof AnimatedInfiniteScrollList;

export interface IAnimatedInfiniteScrollListWithRef
  extends AnimatedInfiniteScrollListType {
  (
    props: InfiniteScrollListProps<any> & {
      ref?: React.Ref<FlashList<any>>;
      overscan?: number;
    }
  ): React.ReactElement | null;
}

export type Channel = {
  id: number;
  channel_reactions: ChannelReactionResponse;
  created_at: string;
  updated_at: string;
  member_count: number;
  name: string;
  latest_message?: ChannelLatestMessage;
  latest_message_updated_at: string | null;
  owner: ChannelProfile;
};

export type ChannelPermissions = {
  can_send_messages: boolean;
  can_upload_media: boolean;
  can_view_creator_messages: boolean;
  can_view_public_messages: boolean;
};

export type ChannelById = {
  viewer_has_unlocked_messages: boolean;
  latest_paid_nft_slug?: string;
  permissions: ChannelPermissions | null;
} & Channel;

export type ChannelSetting = {
  muted: boolean;
};
