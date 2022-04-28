import React from "react";

import { Text, View } from "design-system";

const TableHead = () => {
  return (
    <View tw="flex flex-row bg-gray-100 py-2 px-4 dark:bg-gray-900">
      <View tw="min-w-[128px] flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          Event
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          From
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          To
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          Quantity
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          Date
        </Text>
      </View>
    </View>
  );
};

export default TableHead;
