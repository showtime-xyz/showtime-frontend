import { Skeleton as MotiSkeleton } from "moti/skeleton";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { styled } from "@showtime-xyz/universal.tailwind";

import { SkeletonProps } from "./type";

const StyledSkeleton = styled(MotiSkeleton);

function Skeleton({ tw, colorMode: colorModeProps, ...props }: SkeletonProps) {
  const { colorScheme } = useColorScheme();

  return (
    <StyledSkeleton
      colorMode={colorModeProps ?? colorScheme ?? "light"}
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
