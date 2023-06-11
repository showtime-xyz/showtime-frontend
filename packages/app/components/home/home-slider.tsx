import { useRef, useCallback, useMemo } from "react";
import { Dimensions, FlatList, FlatListProps } from "react-native";

type Props<T> = Pick<FlatListProps<T>, "data" | "renderItem">;
export function HomeSlider<T>({ data, ...rest }: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      decelerationRate={0.9}
      showsHorizontalScrollIndicator={false}
      {...rest}
    />
  );
}
