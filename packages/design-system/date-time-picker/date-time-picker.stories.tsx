import React from "react";
import { Pressable, Text, View } from "react-native";

import { DateTimePicker } from "./date-time-picker";

export default {
  component: DateTimePicker,
  title: "Components/DateTimePicker",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Basic = () => {
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
        <Text>Date {date.toString()}</Text>
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
