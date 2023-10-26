import { memo } from "react";
import { Platform } from "react-native";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { InstagramColorful } from "@showtime-xyz/universal.icon";

export const InstagramButton = memo(function InstagramButton({
  ctaCopy = "Share on Instagram",
  ...rest
}: { ctaCopy?: string } & ButtonProps) {
  if (Platform.OS === "web") {
    return null;
  }
  return (
    <Button variant="primary" size="regular" theme="dark" {...rest}>
      <>
        <InstagramColorful width={20} height={20} />
      </>
      {` ${ctaCopy}`}
    </Button>
  );
});
