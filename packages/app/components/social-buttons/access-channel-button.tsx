import { memo } from "react";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { CreatorChannelType } from "@showtime-xyz/universal.icon";

export const AccessChannelButton = memo(function AccessChannelButton({
  ctaCopy = "Access Channel",
  theme,
  ...rest
}: { ctaCopy?: string } & ButtonProps) {
  return (
    <Button size="regular" {...rest} theme={theme}>
      <CreatorChannelType
        width={20}
        height={20}
        color={theme === "dark" ? "#000" : "#fff"}
      />
      {` ${ctaCopy}`}
    </Button>
  );
});
