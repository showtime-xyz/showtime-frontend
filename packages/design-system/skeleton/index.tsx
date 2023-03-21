import { ComponentProps } from "react";

import { Skeleton as MotiSkeleton } from "moti/skeleton";

import { styled } from "design-system/tailwind";
import type { TW } from "design-system/tailwind";

type Props = ComponentProps<typeof MotiSkeleton> & {
  tw?: TW;
};

const StyledSkeleton = styled(MotiSkeleton);

function Skeleton({ tw, ...props }: Props) {
  return (
    <StyledSkeleton {...props} tw={Array.isArray(tw) ? tw.join(" ") : tw} />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
