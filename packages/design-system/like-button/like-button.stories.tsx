import { useState } from "react";

import { Meta } from "@storybook/react";

import { LikeButton } from "./index";

export default {
  component: LikeButton,
  title: "Components/LikeButton",
} as Meta;

export const Basic: React.FC<{}> = () => {
  const [liked, setLiked] = useState(false);
  return (
    <LikeButton
      onPress={() => setLiked(!liked)}
      isLiked={liked}
      likeCount={10}
    />
  );
};
