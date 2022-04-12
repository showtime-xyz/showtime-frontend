import React from "react";

import { Text, View } from "design-system";

import { getNftActivityEventIcon } from "./nft-activity.helpers";
import type { TableRowProps } from "./nft-activity.types";
import UserItem from "./user-item";

const TableRow = ({ ...props }: TableRowProps) => {
  return (
    <View tw="flex flex-row items-center p-4">
      <View tw="flex flex-row items-center flex-1">
        <View tw="mr-2">{getNftActivityEventIcon(props.event_type)}</View>
        <Text tw=" text-gray-600 dark:text-gray-400 text-xs font-semibold">
          {props.event_type}
        </Text>
      </View>
      <View tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold">
        <UserItem
          imageUrl={props.to_img_url}
          title={props.to_username}
          verified={props.to_verified}
        />
      </View>
      <Text tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold">
        Row {/** TODO(enes): add relative time */}
      </Text>
    </View>
  );
};

export default TableRow;
