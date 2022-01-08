import { Meta } from "@storybook/react";

import { BottomSheet } from "./index";
import { useState } from "react";
import { View } from "@showtime/universal-ui.view";
import { Button } from "@showtime/universal-ui.button";
import { Text } from "@showtime/universal-ui.text";

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
