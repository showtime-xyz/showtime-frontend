import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Accordion } from "./index";

export default {
  component: Accordion.Root,
  title: "Components/Accordion",
} as Meta;

const Container = (props: any) => {
  return (
    <View tw={" bg-gray-100 p-10 dark:bg-gray-900"} style={{ flex: 1 }}>
      {props.children}
    </View>
  );
};

export const Basic: React.VFC<{}> = () => (
  <Container>
    <Accordion.Root>
      <Accordion.Item value="hello" tw="mb-4">
        <Accordion.Trigger>
          <Accordion.Label>Label</Accordion.Label>
        </Accordion.Trigger>
        <Accordion.Content>
          <Text tw="text-gray-900 dark:text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries
          </Text>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="world">
        <Accordion.Trigger>
          <Accordion.Label>Label</Accordion.Label>
          <Accordion.Chevron />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text tw="text-gray-900 dark:text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries
          </Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Container>
);
