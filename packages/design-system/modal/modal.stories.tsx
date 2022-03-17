import { useState } from "react";

import { Meta } from "@storybook/react";

import { Button } from "../button";
import { Text } from "../text";
import { View } from "../view";
import { Modal } from "./index";

export default {
  component: Modal,
  title: "Components/Modal",
} as Meta;

const Container = (props: any) => {
  return <View tw={"dark:bg-gray-100 p-10 bg-white"}>{props.children}</View>;
};

export const Basic: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>
        <Text tw="text-white dark:text-black">Open modal</Text>
      </Button>
      {visible && (
        <Modal title="Modal" close={() => setVisible(false)}>
          <View>
            <Text tw="dark:text-white text-black">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </View>
        </Modal>
      )}
    </Container>
  );
};

export const AutoHeight: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>
        <Text tw="text-white dark:text-black">Open modal</Text>
      </Button>
      {visible && (
        <Modal title="Modal" close={() => setVisible(false)} height="">
          <View>
            <Text tw="dark:text-white text-black">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </View>
        </Modal>
      )}
    </Container>
  );
};
