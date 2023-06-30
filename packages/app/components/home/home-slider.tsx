import { FlatList, FlatListProps } from "react-native";

type Props<T> = Pick<FlatListProps<T>, "data" | "renderItem"> & {
  slidesPerView?: number;
};
export function HomeSlider<T>({ data, ...rest }: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      decelerationRate={0.97}
      showsHorizontalScrollIndicator={false}
      {...rest}
    />
  );
}
