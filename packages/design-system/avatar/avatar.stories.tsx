import { Meta } from "@storybook/react";

import { Avatar } from "./index";

export default {
  component: Avatar,
  title: "Components/Avatar",
} as Meta;

export const Basic: React.VFC<{}> = () => (
  <Avatar
    avatarUrl="https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1"
    showTokenIcon
  />
);
