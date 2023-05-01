import { View } from "@showtime-xyz/universal.view";

import { Avatar } from "./index";

const URL =
  "https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1";

export default {
  component: Avatar,
  title: "Components/Avatar",
};

export const Basic = () => (
  <View tw="flex-1 items-center justify-center">
    <Avatar url={URL} alt="Avatar" />
    <View tw="h-2" />
    <Avatar url={URL} alt="Avatar" size={38} />
    <View tw="h-2" />
    <Avatar url={URL} alt="Avatar" size={56} />
    <View tw="h-2" />
    <Avatar url={URL} alt="Avatar" size={96} />
  </View>
);
