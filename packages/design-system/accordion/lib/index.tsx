import React, { useMemo, useCallback, useState, useContext } from "react";
import { Pressable } from "react-native";
import { useUpdateEffect } from "design-system/hooks";
import { AnimateHeight } from "../animate-height";
import { RootProps, ContentProps, ItemProps, TriggerProps } from "./types";
import { RootContext, ItemContext } from "./common";

const Root = (props: RootProps) => {
  const { value: propValue, onValueChange } = props;
  const [value, setValue] = useState(propValue);

  const handleValueChange = useCallback(
    (newValue: string) => {
      onValueChange?.(newValue);
      setValue(newValue);
    },
    [setValue, onValueChange, value]
  );

  useUpdateEffect(() => {
    setValue(propValue);
  }, [propValue]);

  return (
    <RootContext.Provider
      value={useMemo(
        () => ({ value, handleValueChange }),
        [value, handleValueChange]
      )}
    >
      {props.children}
    </RootContext.Provider>
  );
};

const Item = ({ disabled, value, ...props }: ItemProps) => {
  return (
    <ItemContext.Provider value={{ value, disabled }}>
      {props.children}
    </ItemContext.Provider>
  );
};

const Trigger = (props: TriggerProps) => {
  const { handleValueChange, value: selectedValue } = useContext(RootContext);
  const { value: itemValue, disabled } = useContext(ItemContext);
  const handlePress = () => {
    if (!disabled) {
      if (itemValue === selectedValue) {
        handleValueChange(null);
      } else {
        handleValueChange(itemValue);
      }
    }
  };
  return <Pressable onPress={handlePress}>{props.children}</Pressable>;
};

const Content = (props: ContentProps) => {
  const { value: selectedValue } = useContext(RootContext);
  const { value: itemValue } = useContext(ItemContext);

  return (
    <AnimateHeight hide={itemValue !== selectedValue}>
      {props.children}
    </AnimateHeight>
  );
};

export const Accordion = {
  Root,
  Item,
  Trigger,
  Content,
  ItemContext,
  RootContext,
};
