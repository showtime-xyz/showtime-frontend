import { getStorybookUI } from "@storybook/react-native";

import "./storybook.requires";

const StorybookUIRoot = getStorybookUI({
  // onDeviceUI: false,
  // disableWebsockets: true,
  // shouldPersistSelection: true,
  shouldPersistSelection: true,
  enableWebsockets: true,
});

export default StorybookUIRoot;
