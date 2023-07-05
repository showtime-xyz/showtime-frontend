import { FlatList, FlatListProps, Dimensions } from "react-native";

type Props<T> = Pick<FlatListProps<T>, "data" | "renderItem"> & {
  slidesPerView?: number;
};
export function HomeSlider<T>({ data, ...rest }: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate={"fast"}
      snapToInterval={Dimensions.get("window").width - 32}
      {...rest}
    />
  );
}
