import { Text } from "design-system/text";
import { View } from "design-system/view";

type DataPillProps = {
  type?: "primary" | "secondary";
  label?: string;
};

export const DataPill = (props: DataPillProps) => {
  const { type = "primary", label } = props;

  return (
    <View tw="dark:bg-gray-900 bg-gray-100 items-center justify-center py-2 px-2 rounded-full">
      <Text
        tw={`font-medium text-xs ${
          type === "primary"
            ? "text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 "
        }`}
      >
        {label}
      </Text>
    </View>
  );
};
