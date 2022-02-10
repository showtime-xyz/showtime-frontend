import { render } from "@testing-library/react-native";
import { View, Text } from "react-native";

test("hello world", () => {
  const { debug, getByText } = render(
    <View>
      <Text>hello world</Text>
    </View>
  );
  debug();
  const node = getByText("hello world");
  expect(node).toBeDefined();
});
