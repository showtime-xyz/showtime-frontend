import React, { useCallback } from "react";
import { FlatList } from "react-native";

import { View } from "design-system";

import { TableProps } from "./nft-activity.types";
import TableHead from "./table-head";
import TableRow from "./table-row";

const ActivityTable = ({ data }: TableProps) => {
  const handleRenderItem = useCallback(({ item, key }) => {
    return <TableRow {...item} />;
  }, []);

  const handleRenderSeparator = useCallback(() => {
    return <View tw="bg-gray-100 dark:bg-gray-900 w-full h-0.25" />;
  }, []);

  return (
    <>
      <TableHead />
      <FlatList
        data={data}
        renderItem={handleRenderItem}
        ItemSeparatorComponent={handleRenderSeparator}
        keyExtractor={(_, index) => index.toString()}
      />
    </>
  );
};

export default ActivityTable;
