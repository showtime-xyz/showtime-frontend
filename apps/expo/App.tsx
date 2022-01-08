import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const PinchToZoom = ({ children }) => {
  // const offset = useSharedValue({ x: 0, y: 0 });
  // const isPressed = useSharedValue(false);

  // const start = useSharedValue({ x: 0, y: 0 });
  // const gestureDetector = Gesture.Pan()
  //   .onBegin(() => {
  //     isPressed.value = true;
  //   })
  //   .onUpdate((e) => {
  //     console.log("lol ", e.numberOfPointers);
  //     console.log("lol ", e.x, e.y);
  //     offset.value = {
  //       x: e.translationX + start.value.x,
  //       y: e.translationY + start.value.y,
  //     };
  //   })
  //   .onEnd(() => {
  //     start.value = {
  //       x: offset.value.x,
  //       y: offset.value.y,
  //     };
  //   })
  //   .onFinalize(() => {
  //     isPressed.value = false;
  //   });

  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { translateX: offset.value.x },
  //       { translateY: offset.value.y },
  //       { scale: withSpring(isPressed.value ? 1.2 : 1) },
  //     ],
  //   };
  // });

  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(dragGesture, zoomGesture);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <PinchToZoom>
        <Image
          style={{ height: 235, width: 354 }}
          source={{
            uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80",
          }}
        />
      </PinchToZoom>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
