import { useCallback, useContext } from "react";

import { Select } from "@showtime-xyz/universal.select";
import { View } from "@showtime-xyz/universal.view";

import { Collection } from "app/hooks/api-hooks";

import { FilterContext } from "./fillter-context";

const sortFields = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Likes", value: "likes" },
  { label: "Comments", value: "comments" },
  { label: "Custom", value: "custom" },
];

type FilterProps = {
  collections: Collection[];
};
// Todo: Select support web.
export const ProfileListFilter = ({ collections }: FilterProps) => {
  const { filter, dispatch } = useContext(FilterContext);

  const onCollectionChange = useCallback(
    (value: number | string) => {
      dispatch({ type: "collection_change", payload: value });
    },
    [dispatch]
  );

  const onSortChange = useCallback(
    (value: number | string) => {
      dispatch({ type: "sort_change", payload: value });
    },
    [dispatch]
  );

  return (
    <View tw="flex-row justify-around">
      <Select
        value={filter.collectionId}
        onChange={onCollectionChange}
        options={collections.map((collection) => ({
          value: collection.collection_id,
          label: collection.collection_name,
        }))}
        size="small"
        placeholder="Collection"
        tw="mr-2"
      />
      <Select
        value={filter.sortType}
        onChange={onSortChange}
        options={sortFields}
        size="small"
        placeholder="Sort"
      />
      {/* <Pressable
        style={tw.style(
          "bg-black rounded-full dark:bg-white items-center justify-center flex-row px-3 py-2"
        )}
      >
        <Text tw="text-white text-center dark:text-gray-900 font-bold text-xs">
          Customize
        </Text>
      </Pressable> */}
    </View>
  );
};
