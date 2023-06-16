import { Button } from "@showtime-xyz/universal.button";
import { ChevronRight, ChevronLeft } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

type ControllerProps = {
  prev: () => void;
  next: () => void;
  tw?: string;
  allowSlideNext?: boolean;
  allowSlidePrev?: boolean;
};
export const Controller = ({
  prev,
  next,
  tw = "",
  allowSlideNext = false,
  allowSlidePrev = false,
}: ControllerProps) => {
  return (
    <View
      tw={[
        "absolute top-1/2 z-10 hidden w-full -translate-y-4 flex-row  justify-between md:flex",
        tw,
      ]}
    >
      <Button
        variant="secondary"
        size="small"
        iconOnly
        tw={[
          "absolute -left-4 border border-gray-200 transition-all dark:border-gray-800",
          allowSlidePrev ? "opacity-100" : "opacity-0",
        ]}
        onPress={() => {
          prev?.();
        }}
      >
        <ChevronLeft width={24} height={24} />
      </Button>
      <Button
        variant="secondary"
        size="small"
        iconOnly
        tw={[
          "absolute -right-4 border border-gray-200 transition-all dark:border-gray-800",
          allowSlideNext ? "opacity-100" : "opacity-0",
        ]}
        onPress={() => {
          next?.();
        }}
      >
        <ChevronRight width={24} height={24} />
      </Button>
    </View>
  );
};
