import { Button } from "@showtime-xyz/universal.button";
import { ChevronRight, ChevronLeft } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

type ControllerProps = {
  prev: () => void;
  next: () => void;

  tw: string;
};
export const Controller = ({ prev, next, tw }: ControllerProps) => {
  return (
    <View
      tw={[
        "absolute top-1/2 z-10 w-full -translate-y-4  flex-row justify-between",
        tw,
      ]}
    >
      <Button
        variant="secondary"
        size="small"
        iconOnly
        tw="absolute -left-4 border border-gray-200 dark:border-gray-800"
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
        tw="absolute -right-4 border border-gray-200 dark:border-gray-800"
        onPress={() => {
          next?.();
        }}
      >
        <ChevronRight width={24} height={24} />
      </Button>
    </View>
  );
};
