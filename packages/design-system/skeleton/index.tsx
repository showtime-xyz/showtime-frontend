import { ComponentProps } from "react";

import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { styled } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

const StyledSkeleton = styled(MotiSkeleton);

type Props = ComponentProps<typeof MotiSkeleton> & {
  tw?: TW;
};

function Skeleton({ tw, ...props }: Props) {
  return (
    <StyledSkeleton {...props} tw={Array.isArray(tw) ? tw.join(" ") : tw} />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
