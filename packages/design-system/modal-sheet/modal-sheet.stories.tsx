import { useState } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ModalSheet } from "./index";

export default {
  component: ModalSheet,
  title: "Components/ModalSheet",
};

const Container = (props: any) => {
  return <View tw={"bg-white p-10 dark:bg-gray-100"}>{props.children}</View>;
};

export const Basic = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>Open ModalSheet</Button>
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
