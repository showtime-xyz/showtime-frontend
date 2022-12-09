import React from "react";
import { Pressable, Text, View } from "react-native";

import { Meta } from "@storybook/react";

import { DateTimePicker } from "./date-time-picker";

export default {
  component: DateTimePicker,
  title: "Components/DateTimePicker",
} as Meta;

export const Basic: React.FC<{}> = () => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{ marginTop: 100 }}
        onPress={() => {
          setOpen(!open);
        }}
      >
        <Text
          dataSet={{
            "data-chromatic": "ignore",
          }}
        >
          Date {date.toString()}
        </Text>
      </Pressable>

      <DateTimePicker
        type="datetime"
        onChange={(d) => {
          setOpen(false);
          setDate(d);
        }}
        // @ts-ignore
        dataSet={{
          "data-chromatic": "ignore",
        }}
        value={date}
        open={open}
      />
    </View>
  );
};
