import { Platform } from "react-native";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { InstagramColorful } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

export const InstagramButton = ({
  ctaCopy = "Share on Instagram",
  ...rest
}: { ctaCopy?: string } & ButtonProps) => {
  if (Platform.OS === "web") {
    return null;
  }
  return (
    <Button variant="primary" size="regular" {...rest}>
      <>
        <InstagramColorful width={20} height={20} />
      </>
      {` ${ctaCopy}`}
    </Button>
  );
};
