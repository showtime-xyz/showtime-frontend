import { Meta } from "@storybook/react";

import { Message } from "./message";

export default {
  component: Message,
  title: "Components/Messages/Message",
} as Meta;

const comments = [
  {
    added: "2022-01-07T18:20:35.677",
    address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
    comment_id: 103864,
    commenter_profile_id: 51,
    img_url:
      "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
    like_count: 0,
    likers: [],
    name: "Alex Kilkka",
    nft_id: 23882193,
    replies: [],
    text: "But how would you do this at 15 MPH 🤔",
    username: "alex",
    verified: 1,
  },
  {
    added: "2022-01-07T18:21:52.972",
    address: "0x8a9783c7f9a2a3a67120fabe46150da5082949f7",
    comment_id: 103865,
    commenter_profile_id: 332682,
    img_url: null,
    like_count: 1,
    likers: [
      {
        comment_id: 103865,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        name: "Alex Kilkka",
        profile_id: 51,
        timestamp: "2022-01-07T18:22:18.311",
        username: "alex",
        verified: 1,
        wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
      },
    ],
    name: "kmeister",
    nft_id: 23882193,
    replies: [
      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 103866,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },
    ],
    text: "Hard to say haha! @[Alex Kilkka](alex) ",
    username: "kmeister",
    verified: 0,
  },
];

export const SingleMessage: React.VFC<{}> = () => (
  <Message message={comments[0]} />
);

export const MessageWithReply: React.VFC<{}> = () => (
  <Message message={comments[1]} />
);
