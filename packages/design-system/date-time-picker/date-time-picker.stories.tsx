import React from "react";

import { Meta } from "@storybook/react";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { DateTimePicker } from "./date-time-picker";

export default {
  component: DateTimePicker,
  title: "Components/DateTimePicker",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  return (
    <View tw="flex-row items-center">
      <Pressable
        style={{ marginTop: 100 }}
        onPress={() => {
          setOpen(!open);
        }}
      >
        <Text style={{ color: "red" }}>Date {date.toString()}</Text>
      </Pressable>

      <DateTimePicker
        type="datetime"
        onChange={(d) => {
          setOpen(false);
          setDate(d);
        }}
        value={date}
        open={open}
      />
    </View>
  );
};
