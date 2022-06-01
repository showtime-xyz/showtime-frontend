import React, { useMemo, useCallback, useState, useContext } from "react";
import { Pressable } from "react-native";

import { useUpdateEffect } from "@showtime-xyz/universal.hooks";

import { AnimateHeight } from "../animate-height";
import { RootContext, ItemContext } from "./common";
import { RootProps, ContentProps, ItemProps, TriggerProps } from "./types";

const Root = (props: RootProps) => {
  const { value: propValue, onValueChange } = props;
  const [value, setValue] = useState(propValue);

  const handleValueChange = useCallback(
    (newValue: string) => {
      onValueChange?.(newValue);
      setValue(newValue);
    },
    [setValue, onValueChange]
  );

  useUpdateEffect(() => {
    setValue(propValue);
    // @ts-ignore
  }, [propValue]);

  return (
    <RootContext.Provider
      // @ts-ignore
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
        // @ts-ignore
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
