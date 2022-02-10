jest.mock("react-native-ios-context-menu", () => {
  const RN = jest.requireActual("react-native");

  return {
    RCTContextMenuView: () => RN.View,
    ContextMenuButton: "TouchableOpacity",
  };
});
