import { ComponentProps } from "react";
import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { styled } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

const StyledSkeleton = styled(MotiSkeleton)();

type Props = ComponentProps<typeof StyledSkeleton> & {
  tw?: TW;
};

function Skeleton({ tw, sx, ...props }: Props) {
  return <StyledSkeleton sx={{ ...sx, ...tailwind.style(tw) }} {...props} />;
}
Skeleton.displayName = "Skeleton";

export { Skeleton };
