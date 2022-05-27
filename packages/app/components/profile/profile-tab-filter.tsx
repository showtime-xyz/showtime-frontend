import { Collection } from "app/hooks/api-hooks";
import { getSortFields } from "app/utilities";

import { Select, View } from "design-system";

const sortFields = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Likes", value: "likes" },
  { label: "Comments", value: "comments" },
  { label: "Custom", value: "custom" },
];

type FilterProps = {
  onCollectionChange: (id: number) => void;
  collections: Collection[];
  onSortChange: (id: string) => void;
  collectionId: number;
  sortType: string;
};
// Todo: Select support web.
export const ProfileListFilter = ({
  onCollectionChange,
  collections,
  onSortChange,
  collectionId,
  sortType,
}: FilterProps) => {
  return (
    <View tw="flex-row justify-around">
      <Select
        value={collectionId}
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
        value={sortType}
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
