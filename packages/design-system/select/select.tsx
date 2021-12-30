import { useCallback, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import { BottomSheet } from "../bottom-sheet";
import { SelectProps } from "./types";

const keyExtractor = (item) => `select-item-${item.value}`;

export const Select: React.FC<SelectProps> = ({
  size = "regular",
  value,
  placeholder = "Select item",
  options,
  disabled,
  tw = "",
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  //#region callbacks
  const handleSelectItemPress = useCallback(
    (value: string | number) => {
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
    ({ item }) => (
      <SelectItem
        key={`select-item-${item.value}`}
        value={item.value}
        label={item.label}
        size={size}
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
          (value !== undefined &&
            options?.filter((t) => t.value === value)?.[0]?.label) ??
          placeholder
        }
        size={size}
        disabled={disabled}
        onPress={handleSelectButtonPress}
      />
      <BottomSheet visible={open} onDismiss={handleSheetDismiss}>
        <BottomSheetFlatList
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
        />
      </BottomSheet>
    </>
  );
};
