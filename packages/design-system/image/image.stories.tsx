import { Image } from ".";

const URL =
  "https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1";
export default {
  component: Image,
  title: "Components/Image",
};

export const Basic = () => (
  <Image source={{ uri: URL }} alt={"Image"} width={200} height={200} />
);
