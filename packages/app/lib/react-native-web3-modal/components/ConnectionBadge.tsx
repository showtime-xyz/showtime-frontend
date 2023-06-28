import { Platform, StyleSheet, View } from "react-native";

import useTheme from "../hooks/useTheme";
import Web3Text from "./Web3Text";

function ConnectionBadge() {
  const Theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme.background2, borderColor: Theme.overlayThin },
      ]}
    >
      <View style={[styles.circle, { backgroundColor: Theme.green }]} />
      <Web3Text style={[styles.text, { color: Theme.foreground2 }]}>
        Connected
      </Web3Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 108,
    borderRadius: 28,
    backgroundColor: "gray",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 100,
    marginRight: 6,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(43, 238, 108, 0.4)",
        shadowOpacity: 1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        borderColor: "rgba(43, 238, 108, 0.4)",
        borderWidth: 1,
        elevation: 2,
      },
    }),
  },
  text: {
    fontWeight: "600",
  },
});

export default ConnectionBadge;
