import { Input } from "design-system/input";
import SearchIcon from "design-system/icon/Search";
import { View } from "design-system/view";
import { useSearch } from "app/hooks/api/use-search";
import { useState } from "react";
import { FlatList } from "react-native";
import { Spinner } from "design-system/spinner";
import { Text } from "design-system/text";

export const Search = () => {
  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);

  return (
    <View>
      <Input
        placeholder="search"
        value={term}
        autoFocus
        onChangeText={setTerm}
        rightElement={
          <View tw="p-2">
            <SearchIcon color={"black"} width={24} height={24} />
          </View>
        }
      />
      {data ? (
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      ) : loading && term ? (
        <View tw="pt-6 items-center">
          <Spinner size="medium" />
        </View>
      ) : null}
    </View>
  );
};
