import { useCallback, useState } from "react";
import { ListRenderItemInfo } from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { BottomSheet } from "@showtime-xyz/universal.bottom-sheet";

import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import { SelectOption, SelectProps } from "./types";

function keyExtractor<T>(item: SelectOption<T>) {
  return `select-item-${item.value}`;
}

export function Select<T>({
  size = "regular",
  value,
  placeholder = "Select item",
  options,
  disabled,
  onChange,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);

  //#region callbacks
  const handleSelectItemPress = useCallback(
    (value: T) => {
      setOpen(false);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );
  const handleSelectButtonPress = useCallback(
    () => setOpen((state) => !state),
    []
  );
  const handleSheetDismiss = useCallback(() => {
    setOpen(false);
  }, []);
  //#endregion

  const renderSelectItem = useCallback(
    ({ item }: ListRenderItemInfo<SelectOption<T>>) => (
      <SelectItem
        key={`select-item-${item.value}`}
        value={item.value}
        label={item.label}
        size={size}
        // @ts-ignore
        onPress={handleSelectItemPress}
      />
    ),
    [size, handleSelectItemPress]
  );

  return (
    <>
      <SelectButton
        open={open}
        label={
          value !== undefined
            ? options?.filter((t) => t.value === value)?.[0]?.label ??
              placeholder
            : placeholder
        }
        size={size}
        disabled={disabled}
        onPress={handleSelectButtonPress}
      />
      <BottomSheet
        visible={open}
        snapPoints={["60%", "85%"]}
        onDismiss={handleSheetDismiss}
      >
        <BottomSheetFlatList
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
        />
      </BottomSheet>
    </>
  );
}
