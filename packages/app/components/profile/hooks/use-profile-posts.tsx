import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

export type ProfilePost = {
  id: string;
  profile: {
    verified: boolean;
    bio: string;
    profile_id: number;
    name: string;
    username: string;
    wallet_address: string;
    wallet_address_nonens: string;
    img_url: string;
  };
  description: string;
  media: {
    width: number;
    height: number;
    length: number;
    urls: {
      direct: string;
      original: string;
      hls_playlist: string;
      thumbnail: string;
      optimized_thumbnail: string;
      preview_animation: string;
      mp4_720: string;
      mp4_480: string;
      mp4_360: string;
      mp4_240: string;
    };
  };
  deleted_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  creator_token_id: number;
  creator_token_address: string;
  creator_channel_id: number;
};

export const getProfilePostByUsername = (username: string) => {
  return `/v1/posts/profile/${username}`;
};

export const useProfilePosts = (username?: string) => {
  const queryState = useSWR<ProfilePost[]>(
    username ? getProfilePostByUsername(username) : null,
    fetcher
  );

  return queryState;
};
