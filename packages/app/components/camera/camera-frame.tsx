import { View } from "react-native";

export function CameraFrame() {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 25,
          width: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderTopWidth: 2,
          borderLeftWidth: 2,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: 25,
          width: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderTopWidth: 2,
          borderRightWidth: 2,
        }}
      />

      <CrossHair />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          height: 25,
          width: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderBottomWidth: 2,
          borderRightWidth: 2,
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 25,
          width: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderBottomWidth: 2,
          borderLeftWidth: 2,
        }}
      />
    </>
  );
}

function CrossHair() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderWidth: 1,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: 25,
          borderColor: "white",
          borderStyle: "solid",
          borderWidth: 1,
        }}
      />
    </View>
  );
}
