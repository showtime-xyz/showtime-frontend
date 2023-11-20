import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  inputsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  codeContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#DFDFDE",
    minHeight: 60,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontSize: 28,
  },
  hiddenInput: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  stick: {
    width: 2,
    height: 30,
    backgroundColor: "green",
  },
});
