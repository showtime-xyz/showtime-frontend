import React from "react";

import { Text, View } from "design-system";

const TableHead = () => {
  return (
    <View tw="py-2 px-4 bg-gray-100 dark:bg-gray-900 flex flex-row">
      <View tw="flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          Event
        </Text>
      </View>
      <View tw="flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          To
        </Text>
      </View>
      <View tw="flex-1">
        <Text variant="text-xs" tw="font-bold text-gray-700 dark:text-gray-300">
          Date
        </Text>
      </View>
    </View>
  );
};

export default TableHead;
