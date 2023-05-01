import { View } from "react-native";

import { Chip } from "./index";

export default {
  component: Chip,
  title: "Components/Chip",
};

export const Basic = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Chip label="Follows You" />
  </View>
);
