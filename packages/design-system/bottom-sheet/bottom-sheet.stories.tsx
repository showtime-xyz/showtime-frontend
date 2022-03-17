import { useState } from "react";

import { Meta } from "@storybook/react";

import { Button } from "../button";
import { Text } from "../text";
import { View } from "../view";
import { BottomSheet } from "./index";

export default {
  component: BottomSheet,
  title: "Components/BottomSheet",
} as Meta;

const Container = (props: any) => {
  return <View tw={"dark:bg-gray-100 p-10 bg-white"}>{props.children}</View>;
};

export const Basic: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>
        <Text tw="text-white dark:text-black">Open bottom sheet</Text>
      </Button>
      <BottomSheet visible={visible} onDismiss={() => setVisible(false)}>
        <View>
          <Text tw="dark:text-white text-black">Hello world</Text>
        </View>
      </BottomSheet>
    </Container>
  );
};
