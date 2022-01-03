import { ComponentProps } from "react";
import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { styled } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";

const StyledSkeleton = styled(MotiSkeleton)();

type Props = ComponentProps<typeof StyledSkeleton> & {
  tw?: string | string[];
};

function Skeleton({ tw, sx, ...props }: Props) {
  return <StyledSkeleton sx={{ ...sx, ...tailwind.style(tw) }} {...props} />;
}
Skeleton.displayName = "Skeleton";

export { Skeleton };
