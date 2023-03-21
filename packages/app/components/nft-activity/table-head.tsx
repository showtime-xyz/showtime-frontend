import { Text } from "design-system/text";
import { View } from "design-system/view";

const TableHead = () => {
  return (
    <View tw="flex flex-row bg-gray-100 py-2 px-4 dark:bg-gray-900">
      <View tw="min-w-[128px] flex-1">
        <Text tw="text-xs font-bold text-gray-700 dark:text-gray-300">
          Event
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text tw="text-xs font-bold text-gray-700 dark:text-gray-300">
          From
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text tw="text-xs font-bold text-gray-700 dark:text-gray-300">To</Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text tw="text-xs font-bold text-gray-700 dark:text-gray-300">
          Quantity
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text tw="text-xs font-bold text-gray-700 dark:text-gray-300">
          Date
        </Text>
      </View>
    </View>
  );
};

export default TableHead;
