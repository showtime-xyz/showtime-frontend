import { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export type ChipProps = {
  label: string;
  tw?: TW;
  // variant: string;
};
export const Chip = ({ label, tw = "" }: ChipProps) => {
  return (
    <View tw={["rounded-full bg-gray-100 px-2 py-1.5 dark:bg-gray-900", tw]}>
      <Text tw="text-xs font-semibold text-gray-500">{label}</Text>
    </View>
  );
};
