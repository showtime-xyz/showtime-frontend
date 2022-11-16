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
  owner_verified: number;
  comment_count: number;
  owner_count: number;
  token_count: number;
  token_ko_edition?: string;
  token_edition_identifier?: string;
  source_url: string;
  creator_airdrop_edition_address?: string;
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
  backendAddress: string;
  address: string;
  ens_domain?: string;
  minting_enabled: boolean;
  email: string;
  is_email: number;
  is_twitter: number;
  is_google: number;
  is_apple: number;
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

export interface Link {
  id: number;
  user_input: string;
  type_id: number;
  type__name: string;
  type__prefix: string;
  type__icon_url: string;
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
  website_url: string;
  username: string;
  default_list_id: number;
  default_created_sort_id: number;
  default_owned_sort_id: number;
  notifications_last_opened: Date;
  has_onboarded: boolean;
  links: Link[];
  primary_wallet?: WalletAddressesV2;
  has_verified_phone_number: boolean;
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

export type IEdition = {
  id: number;
  contract_address: string;
  minter_address: string;
  description: string;
  edition_size: number;
  image_url: string;
  name: string;
  owner_address: string;
  symbol: string;
  is_gated?: boolean;
  is_spotify_gated?: boolean;
  is_password_gated?: boolean;
};

export type MyInfo = {
  data: {
    follows: Array<{ profile_id: number }>;
    profile: Profile & {
      has_spotify_token: boolean;
      spotify_artist_id: null | number;
    };
    likes_nft: number[];
    likes_comment: any[];
    comments: number[];
    blocked_profile_ids: number[];
    notifications_last_opened: string | null;
    can_create_drop: boolean;
    daily_claim_limit: number;
    claim_tank: {
      available_claims: number;
      next_refill_at: string;
      tank_limit: number;
    };
  };
};
