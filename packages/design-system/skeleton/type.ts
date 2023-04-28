import type { MotiSkeletonProps } from "moti/build/skeleton/types";

import type { TW } from "@showtime-xyz/universal.tailwind";

export type SkeletonProps = Omit<MotiSkeletonProps, "Gradient"> & {
  tw?: TW;
};
