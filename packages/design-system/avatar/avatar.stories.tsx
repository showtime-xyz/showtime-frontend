import { Meta } from "@storybook/react";

import { Avatar } from "./index";

const URL =
  "https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1";

export default {
  component: Avatar,
  title: "Components/Avatar",
} as Meta;

export const Basic: React.VFC<{}> = () => <Avatar url={URL} alt="Avatar" />;

export const withBorder: React.VFC<{}> = () => (
  <Avatar url={URL} alt="Avatar" />
);
