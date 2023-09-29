import { memo } from "react";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { CreatorChannelType } from "@showtime-xyz/universal.icon";

export const AccessChannelButton = memo(function AccessChannelButton({
  ctaCopy = "Access Channel",
  ...rest
}: { ctaCopy?: string } & ButtonProps) {
  return (
    <Button size="regular" {...rest}>
      <CreatorChannelType width={20} height={20} />
      {` ${ctaCopy}`}
    </Button>
  );
});
