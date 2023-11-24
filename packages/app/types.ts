import { ChannelPermissions } from "./components/creator-channels/types";
import { DropPlan } from "./hooks/use-paid-drop-plans";

export type BunnyVideoUrls = {
  direct?: string | null;
  hls_playlist?: string | null;
  mp4_240?: string | null;
  mp4_360?: string | null;
  mp4_480?: string | null;
  mp4_720?: string | null;
  original?: string | null;
  preview_animation?: string | null;
  thumbnail?: string | null;
  optimized_thumbnail?: string | null;
  [key: string]: string | null | undefined;
};

export type NFT = {
  nft_id: number;
  is_user_owner: boolean;
  contract_address: string;
  token_id: string;
  like_count: number;
  token_name: string;
  token_description: string;
  token_img_url?: string;
  token_img_original_url: string;
  token_has_video: number;
  token_animation_url?: any;
  animation_preview_url?: any;
  blurhash: string;
  token_background_color?: any;
  token_aspect_ratio: number;
  token_hidden: number;
  creator_id: number;
  creator_name: string;
  creator_address: string;
  creator_address_nonens: string;
  creator_followers_count?: number;
  owner_address_nonens?: string;
  creator_img_url?: any;
  token_created: string;
  multiple_owners: number;
  owner_id: number;
  owner_name: string;
  owner_address?: string;
  owner_img_url?: string;
  token_creator_followers_only: number;
  creator_username?: string;
  creator_verified: number;
  owner_username?: string;
  slug?: string;
  owner_verified: number;
  comment_count: number;
  owner_count: number;
  token_count: number;
  token_ko_edition?: string;
  token_edition_identifier?: string;
  source_url: string;
  creator_airdrop_edition_address?: string;
  creator_airdrop_edition_contract_version: ContractVersion;
  still_preview_url: string;
  mime_type: string;
  chain_identifier: string;
  token_listing_identifier?: string;
  collection_name: string;
  collection_slug: string;
  collection_img_url?: string;
  contract_is_creator: number;
  multiple_owners_list: Array<OwnersListOwner>;
  listing?: Listing;
  chain_name?: string;
  nsfw?: boolean;
  cloudinary_thumbnail_url: string | null;
  cloudinary_video_url: string | null;
  image_url: string | null;
  image_path: string | null;
  video_urls: BunnyVideoUrls | null;
  creator_channel_id?: number;
  gating_type?: GatingType;
};

export type Creator = {
  profile_id: number;
  name?: string;
  username?: string;
  address: string;
  img_url?: string;
  love_count: number;
  verified: number;
  top_items?: NFT[];
};

export interface WalletAddressesV2 {
  address: string;
  ens_domain?: string;
  minting_enabled: boolean;
  email: string;
  is_email: number;
  is_twitter: number;
  is_google: number;
  is_apple: number;
  is_privy: number;
  phone_number: string;
  is_phone: number;
  nickname?: string;
}

export interface WalletAddressesExcludingEmailV2 {
  address: string;
  ens_domain?: string;
  minting_enabled: boolean;
  nickname?: string;
}
export type StarDropBadgeType = {
  contract_address: string;
  slug: string;
  username: string;
};
export interface Link {
  id: number;
  user_input: string;
  type_id: number;
  type__name: string;
  type__prefix: string;
  type__icon_url: string;
}
export interface SocialLoginConnections {
  email: boolean;
  google: boolean;
  apple: boolean;
  phone: boolean;
  twitter: boolean;
  spotify: boolean;
  instagram: boolean;
}

export interface SocialLoginHandles {
  twitter?: string | null;
  instagram?: string | null;
}

export interface Profile {
  profile_id: number;
  name: string;
  verified: boolean;
  img_url: string;
  cover_url: string;
  minting_enabled: boolean;
  wallet_addresses: string[];
  wallet_addresses_v2: WalletAddressesV2[];
  wallet_addresses_excluding_email_v2: WalletAddressesExcludingEmailV2[];
  bio: string;
  channels: Array<{
    id: number;
    name: string;
    self_is_member: boolean;
    message_count: number;
    permissions: ChannelPermissions | null;
  }>;
  website_url: string;
  username: string;
  default_list_id: number;
  default_created_sort_id: number;
  default_owned_sort_id: number;
  notifications_last_opened: Date;
  links: Link[];
  primary_wallet?: WalletAddressesV2;
  has_verified_phone_number: boolean;
  has_spotify_token: boolean;
  spotify_artist_id?: string;
  apple_music_artist_id?: string;
  bypass_track_ownership_validation?: boolean;
  captcha_completed_at: Date | null;
  has_social_login: boolean;
  social_login_connections: SocialLoginConnections;
  social_login_handles: SocialLoginHandles;
  latest_star_drop_collected?: StarDropBadgeType;
  creator_token_onboarding_status:
    | "allowlist"
    | "onboarded"
    | "requires_invite"
    | "opted_in";
  creator_token?: {
    address: `0x${string}`;
    crossmint_id: string | null;
    id: number;
    total_earnings: string;
  };
}

type FollowType = {
  profile_id: number;
};

export type UserType = {
  data: {
    follows: FollowType[];
    profile: Profile;
    likes_nft: number[];
    likes_comment: number[];
    comments: number[];
    blocked_profile_ids: number[];
  };
};

export type AuthenticationStatus =
  | "IDLE"
  | "REFRESHING"
  | "AUTHENTICATING"
  | "AUTHENTICATED"
  | "UNAUTHENTICATED";

export type WalletConnectionStatus =
  | "IDLE"
  | "CONNECTING_TO_WALLET"
  | "CONNECTED_TO_WALLET"
  | "FETCHING_NONCE"
  | "FETCHED_NONCE"
  | "SIGNING_PERSONAL_MESSAGE"
  | "SIGNED_PERSONAL_MESSAGE"
  | "LOGGING_IN"
  | "LOGGED_IN"
  | "EXPIRING_NONCE"
  | "EXPIRED_NONCE"
  | "CONNECTED"
  | "ERRORED"
  | "FETCHING_SIGNATURE";

export interface OwnersListOwner {
  profile_id: number;
  name: string;
  img_url: string;
  quantity: number;
  username: string;
  verified: boolean;
  address: string;
  wallet_address: string;
}

export interface Listing {
  total_edition_quantity: number;
  quantity: number;
  min_price: number;
  currency: string;
  sale_identifier: number;
  profile_id: number;
  username: string;
  name: string;
  verified: number;
  address: string;
  img_url: string;
  royalty_percentage: number;
  listing_created: string;
  sale_contract: string;
  all_sellers: AllSellers[];
}

export interface AllSellers {
  profile_id: number;
  sale_contract: string;
  sale_identifier: number;
  quantity: number;
}
export enum ContractVersion {
  V1 = 1,
  V2 = 2,
  BATCH_V1 = 3,
}
export type IEdition = {
  id: number;
  contract_address: string;
  contract_version: ContractVersion;
  minter_address: string;
  description: string;
  edition_size: number;
  image_url: string;
  name: string;
  owner_profile_id?: number;
  owner_address: string;
  symbol: string;
  is_gated?: boolean;
  is_spotify_gated?: boolean;
  is_password_gated?: boolean;
};

export type MyInfo = {
  data: {
    follows: Array<{ profile_id: number }>;
    channels: Array<number>;
    profile: Profile & {
      has_spotify_token: boolean;
      has_apple_music_token: boolean;
      spotify_artist_id: null | number;
      channels: Array<{
        id: number;
        name: string;
        self_is_member: boolean;
        message_count: number;
      }>;
      stripe_connect_details: null | {
        details_submitted: boolean;
        charges_enabled: boolean;
        tos_acceptance: string | null;
      };
    };
    likes_nft: number[];
    likes_comment: any[];
    comments: number[];
    blocked_profile_ids: number[];
    notifications_last_opened: string | null;
    can_create_drop: boolean;
    daily_claim_limit: number;
    paid_drop_credits?: DropPlan[];

    claim_tank: {
      available_claims: number;
      next_refill_at: string;
      tank_limit: number;
    };
  };
};

export type GatingType =
  | "spotify_save"
  | "multi_provider_music_save"
  | "multi_provider_music_presave"
  | "password"
  | "location"
  | "multi"
  | "spotify_presave"
  // This is for compatibility with the old spotify_presave
  | "music_presave"
  | "paid_nft";
