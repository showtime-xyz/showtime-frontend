import { Button } from "design-system/button";
import { ChevronRight, ChevronLeft } from "design-system/icon";
import { View } from "design-system/view";

type ControllerProps = {
  prev: () => void;
  next: () => void;

  tw: string;
};
export const Controller = ({ prev, next, tw }: ControllerProps) => {
  return (
    <View tw={["web:px-4 absolute w-full flex-row justify-between", tw]}>
      <Button
        variant="text"
        size="regular"
        iconOnly
        tw="bg-white dark:bg-gray-900"
        onPress={() => {
          prev?.();
        }}
      >
        <ChevronLeft width={24} height={24} />
      </Button>
      <Button
        variant="text"
        size="regular"
        iconOnly
        tw="bg-white dark:bg-gray-900"
        onPress={() => {
          next?.();
        }}
      >
        <ChevronRight width={24} height={24} />
      </Button>
    </View>
  );
};
