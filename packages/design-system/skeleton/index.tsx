import { ComponentProps } from "react";

import { Skeleton as MotiSkeleton } from "moti/skeleton";

import { styled, tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

type Props = ComponentProps<typeof MotiSkeleton> & {
  tw?: TW;
};

const StyledSkeleton = styled(MotiSkeleton);

function Skeleton({ tw, ...props }: Props) {
  return (
    <StyledSkeleton
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      {...tailwind.style(tw)}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
