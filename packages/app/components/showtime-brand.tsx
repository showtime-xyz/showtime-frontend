import { View } from "design-system";
import { Showtime, ShowtimeBrand as ShowtimeName } from "design-system/icon";

type ShowtimeBrandLogoProps = {
  color?: string;
  size?: number;
};
export const ShowtimeBrandLogo = ({
  color = "#fff",
  size = 16,
}: ShowtimeBrandLogoProps) => {
  return (
    <View tw="flex-row">
      <Showtime color={color} width={size} height={size} />
      <View tw="w-1" />
      <ShowtimeName color={color} width={size * (84 / 16)} height={size} />
    </View>
  );
};
