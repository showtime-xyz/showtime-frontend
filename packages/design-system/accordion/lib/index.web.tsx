import React, {
  useMemo,
  useCallback,
  useState,
  useContext,
  forwardRef,
} from "react";
import { Pressable } from "react-native";

import * as RadixAccordion from "@radix-ui/react-accordion";

import { useUpdateEffect } from "@showtime-xyz/universal.hooks";

import { AnimateHeight } from "../animate-height";
import { RootContext, ItemContext } from "./common";
import { RootProps, ContentProps, ItemProps, TriggerProps } from "./types";

const Root = (props: RootProps) => {
  const { value: propValue, onValueChange } = props;
  const [value, setValue] = useState(propValue);

  const handleValueChange = useCallback(
    (newValue: RootProps["value"]) => {
      onValueChange?.(newValue as string);
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
      <RadixAccordion.Root
        value={value}
        onValueChange={handleValueChange}
        type="single"
        collapsible
      >
        {props.children}
      </RadixAccordion.Root>
    </RootContext.Provider>
  );
};

const TriggerPressable = forwardRef<unknown, any>((props, ref) => {
  return (
    <Pressable
      accessibilityRole="button"
      ref={ref}
      {...props}
      onPress={props.onClick}
    >
      {props.children}
    </Pressable>
  );
});
TriggerPressable.displayName = "TriggerPressable";

const Trigger = (props: TriggerProps) => {
  return (
    <RadixAccordion.Trigger asChild>
      <TriggerPressable>{props.children}</TriggerPressable>
    </RadixAccordion.Trigger>
  );
};

const Item = (props: ItemProps) => {
  return (
    <RadixAccordion.Item value={props.value} disabled={props.disabled}>
      <ItemContext.Provider
        value={{ value: props.value, disabled: props.disabled }}
      >
        {props.children}
      </ItemContext.Provider>
    </RadixAccordion.Item>
  );
};

const Content = (props: ContentProps) => {
  const { value: selectedValue } = useContext(RootContext);
  const { value: itemValue } = useContext(ItemContext);
  return (
    <RadixAccordion.Content forceMount>
      <AnimateHeight hide={selectedValue !== itemValue}>
        {props.children}
      </AnimateHeight>
    </RadixAccordion.Content>
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
