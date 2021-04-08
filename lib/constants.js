export const CONTRACTS = {
  ZORA: "0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7",
  RARIBLE_V2: "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
  RARIBLE_1155: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
  KNOWNORIGIN: "0xfbeef911dc5821886e1dda71586d90ed28174b7d",
  FOUNDATION: "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405",
  SUPERRARE_V1: "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
  SUPERRARE_V2: "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0",
  ASYNCART_V1: "0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad",
  ASYNCART_V2: "0xb6dae651468e9593e4581705a09c10a76ac1e0c8",
};

// fields to sort by on profile page
export const SORT_FIELDS = {
  LIKE_COUNT: { label: "Popularity", key: "like_count", id: 1, value: 1 },
  NEWEST: {
    label: "Newest",
    key: "newest",
    id: 2,
    value: 2,
  },
  OLDEST: {
    label: "Oldest",
    key: "oldest",
    id: 3,
    value: 3,
  },
  COMMENT_COUNT: { label: "Comments", key: "comment_count", id: 4, value: 4 },
};

export const getNotificationInfo = (type) => {
  switch (type) {
    case 1:
      return {
        type: "followed_me",
        icon: "user",
        goTo: "profile",
        color: "#6bd464",
      };
    case 2:
      return {
        type: "liked_my_creation",
        icon: "heart",
        goTo: "nft",
        color: "#ff5151",
      };
    case 3:
      return {
        type: "liked_my_owned",
        icon: "heart",
        goTo: "nft",
        color: "#ff5151",
      };
    case 4:
      return {
        type: "commented_my_creation",
        icon: "comment",
        goTo: "nft",
        color: "#5454ff",
      };
    case 5:
      return {
        type: "commented_my_owned",
        icon: "comment",
        goTo: "nft",
        color: "#5454ff",
      };
    default:
      return {
        type: "no_type_exists",
        icon: "user",
        goTo: "profile",
        color: "#6bd464",
      };
  }
};
