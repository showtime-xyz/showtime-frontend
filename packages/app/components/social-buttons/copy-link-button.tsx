import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Link } from "@showtime-xyz/universal.icon";

export const CopyLinkButton = ({
  ctaCopy = "Copy Link",
  ...rest
}: { ctaCopy?: string } & ButtonProps) => {
  return (
    <Button size="regular" {...rest}>
      <Link width={20} height={20} />
      {` ${ctaCopy}`}
    </Button>
  );
};
