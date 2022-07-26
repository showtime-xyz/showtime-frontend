import React, { useCallback } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import type { Activity, TableProps } from "./nft-activity.types";
import TableHead from "./table-head";
import TableRow from "./table-row";

const ActivityTable = ({ data }: TableProps) => {
  const handleRenderItem = useCallback(({ item }: { item: Activity }) => {
    return <TableRow {...item} />;
  }, []);

  const handleRenderSeparator = useCallback(() => {
    return <View tw="h-0.25 w-full bg-gray-100 dark:bg-gray-900" />;
  }, []);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <TableHead />
        <FlatList
          data={data}
          renderItem={handleRenderItem}
          ItemSeparatorComponent={handleRenderSeparator}
          keyExtractor={(_, index) => index.toString()}
        />
      </ScrollView>
    </>
  );
};

export default ActivityTable;

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    flexDirection: "column",
  },
});
