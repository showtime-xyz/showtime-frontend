import { Text } from "design-system/text";
import { View } from "design-system/view";

type DataPillProps = {
  type?: "primary" | "secondary";
  label?: string;
};

export const DataPill = (props: DataPillProps) => {
  const { type = "primary", label } = props;

  return (
    <View
      tw={`items-center justify-center py-2 px-2 rounded-full ${
        type === "primary"
          ? "dark:bg-gray-900 bg-gray-100 "
          : " bg-gray-900 dark:bg-gray-100"
      }`}
    >
      <Text
        tw={`font-medium text-xs ${
          type === "primary"
            ? "text-gray-500 "
            : " text-white dark:text-gray-900"
        }`}
      >
        {label}
      </Text>
    </View>
  );
};
