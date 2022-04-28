import { useState } from "react";

import { Meta } from "@storybook/react";

import { Button } from "../button";
import { Text } from "../text";
import { View } from "../view";
import { ModalSheet } from "./index";

export default {
  component: ModalSheet,
  title: "Components/ModalSheet",
} as Meta;

const Container = (props: any) => {
  return <View tw={"bg-white p-10 dark:bg-gray-100"}>{props.children}</View>;
};

export const Basic: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>
        <Text tw="text-white dark:text-black">Open ModalSheet</Text>
      </Button>
      <ModalSheet
        title="Modal Sheet"
        visible={visible}
        close={() => setVisible(false)}
      >
        <View>
          <Text tw="text-black dark:text-white">Hello world</Text>
        </View>
      </ModalSheet>
    </Container>
  );
};
