import { memo } from "react";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Twitter } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";

export const TwitterButton = memo(function TwitterButton({
  ctaCopy = "Tweet",
  ...rest
}: { ctaCopy?: string } & ButtonProps) {
  return (
    <Button
      size="regular"
      {...rest}
      style={{
        backgroundColor: "#4A99E9",
      }}
    >
      <Twitter color="white" width={20} height={20} />
      <Text
        tw="ml-1 text-sm font-semibold"
        style={{
          color: "white",
        }}
      >
        {ctaCopy}
      </Text>
    </Button>
  );
});
