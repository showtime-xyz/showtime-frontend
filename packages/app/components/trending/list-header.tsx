import { memo } from "react";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type ListHeaderProps = {
  isLoading: boolean;
  length?: number;
  SelectionControl?: JSX.Element;
};

export const ListHeader = memo<ListHeaderProps>(function ListHeader({
  isLoading,
  SelectionControl,
  length = 0,
}) {
  return (
    <View
      tw="border-gray-100 p-4 dark:border-gray-900"
      style={{ borderBottomWidth: 1 }}
    >
      {SelectionControl}
      {length === 0 && !isLoading ? (
        <View tw="mt-20 items-center justify-center">
          <Text tw="text-gray-900 dark:text-white">No results found</Text>
        </View>
      ) : isLoading ? (
        <View tw="mt-20 items-center justify-center">
          <Spinner size="small" />
        </View>
      ) : null}
    </View>
  );
});
