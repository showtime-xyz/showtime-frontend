import { AxiosRequestConfig } from "axios";

import { Profile } from "app/types";

const axios = jest.requireActual("axios");

const mockUserProfile: Profile = {
  profile_id: 1,
  name: "test",
  verified: false,
  img_url: "http://showtime.xyz",
  cover_url: "http://showtime.xyz",
  minting_enabled: false,
  wallet_addresses: ["abc"],
  wallet_addresses_v2: [
    {
      address: "abc",
      minting_enabled: false,
      email: "abc@xyz.com",
      is_email: 1,
    },
  ],
  wallet_addresses_excluding_email_v2: [
    {
      address: "abc",
      minting_enabled: false,
    },
  ],
  bio: "abc",
  website_url: "test.com",
  username: "abc",
  default_list_id: 1,
  default_created_sort_id: 1,
  default_owned_sort_id: 1,
  notifications_last_opened: new Date(),
  has_onboarded: true,
  links: [],
};

module.exports = jest.fn(async (params: AxiosRequestConfig) => {
  if (params.url === "/v3/feed/default?offset=1&limit=5") {
    return Promise.resolve({ data: [] });
  }

  if (params.url === "/v3/feed/curated?offset=1&limit=5") {
    return Promise.resolve({ data: [] });
  }

  if (params.url === "/v3/feed/following?offset=1&limit=5") {
    return Promise.resolve({ data: [] });
  }

  if (params.url === "/v1/jwt/refresh") {
    return Promise.resolve({
      data: { access: "token", refresh: "new-refresh-token" },
    });
  }

  if (
    params.url.includes("/api/v1/notifications") &&
    params.method.toLowerCase() === "get"
  ) {
    return Promise.resolve({
      data: { data: [] },
    });
  }

  if (params.url === "/v2/myinfo") {
    return Promise.resolve({
      data: {
        data: {
          profile: mockUserProfile,
          follows: [],
          likes_nft: [],
          likes_comment: [],
          comments: [],
          blocked_profile_ids: [],
        },
      },
    });
  }

  if (params.url === "/v3/feed?offset=1&limit=5") {
    return Promise.resolve({ data: [] });
  }

  return axios(params);
});
