import { StyleSheet, Image } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const useViewDimension = () => {
  const dimension = { width: useSharedValue(0), height: useSharedValue(0) };
  return {
    onLayout: (e) => {
      dimension.height.value = e.nativeEvent.layout.height;
      dimension.width.value = e.nativeEvent.layout.width;
    },
    dimension,
  };
};

const PinchToZoom = ({ children, onGestureEnd, onDoubleTap }) => {
  const offset = { x: useSharedValue(0), y: useSharedValue(0) };
  const start = { x: useSharedValue(0), y: useSharedValue(0) };
  const scaleOrigin = { x: useSharedValue(0), y: useSharedValue(0) };
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const dragState = useSharedValue("idle");
  const zoomState = useSharedValue("idle");
  const { dimension, onLayout } = useViewDimension();

  // If we don't handle this case, it can cause initial zoom in jank if user has done pan gesture and didn't release their fingers and started zooming in!
  // Proper solution for this is enabling Pan gesture only when a user is zoomed in, this currently doesn't seem to be possible with gesture-handler
  // Perfect solution would be to set enabled property of PanGestureHandler with a state (which doesn't work)
  const anEdgeCaseAdjustment = { x: useSharedValue(0), y: useSharedValue(0) };

  // If user has zoomed in, enable pan
  const enablePanGesutreHandler = useSharedValue(false);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      dragState.value = "start";
      start.x.value = offset.x.value;
      start.y.value = offset.y.value;

      anEdgeCaseAdjustment.x.value = 0;
      anEdgeCaseAdjustment.y.value = 0;
    })
    .onUpdate((e) => {
      if (enablePanGesutreHandler.value) {
        offset.x.value =
          e.translationX - anEdgeCaseAdjustment.x.value + start.x.value;
        offset.y.value =
          e.translationY - anEdgeCaseAdjustment.y.value + start.y.value;
      } else {
        anEdgeCaseAdjustment.x.value = e.translationX;
        anEdgeCaseAdjustment.y.value = e.translationY;
      }
    })
    .onEnd(() => {
      dragState.value = "ended";
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(typeof onDoubleTap === "function")
    .numberOfTaps(2)
    .onEnd((e, success) => {
      if (success) {
        // Only set starting origin on zoom in.
        if (scale.value === 1) {
          scaleOrigin.x.value = e.x;
          scaleOrigin.y.value = e.y;
        }
        // If user is zoomed in, they're probably gonna zoom out on double tap, so disable pan
        // probably bad assumption, figure out later
        if (scale.value > 1) {
          enablePanGesutreHandler.value = false;
        } else {
          enablePanGesutreHandler.value = true;
        }
        onDoubleTap({ scale, offset });
      }
    });

  const zoomGesture = Gesture.Pinch()
    .onStart(() => {
      zoomState.value = "start";
      savedScale.value = scale.value;
      enablePanGesutreHandler.value = true;
    })
    .onUpdate((event) => {
      // Setting scaleOrigin on active instead of begin because of an issue in android.
      // This PR should fix it. https://github.com/software-mansion/react-native-gesture-handler/pull/1798
      // Also we set scale translate origin on start. Not sure but Pan translate's don't behave very well with zoomed in (scale > 1) Views
      if (zoomState.value === "start" && scale.value === 1) {
        scaleOrigin.x.value = event.focalX;
        scaleOrigin.y.value = event.focalY;
      }

      scale.value = savedScale.value * event.scale;
      zoomState.value = "active";
    })
    .onEnd(() => {
      zoomState.value = "ended";
    });

  const composed = Gesture.Exclusive(
    Gesture.Simultaneous(dragGesture, zoomGesture),
    doubleTapGesture
  );

  useAnimatedReaction(
    () => {
      return zoomState.value === "ended" && dragState.value === "ended";
    },
    (ended) => {
      if (ended) {
        onGestureEnd?.({ scale, offset, start });
        dragState.value = "idle";
        zoomState.value = "idle";
        enablePanGesutreHandler.value = false;
      }
    }
  );

  const animatedStyles = useAnimatedStyle(() => {
    const transformOriginTop =
      -dimension.height.value / 2 + scaleOrigin.y.value;
    const transformOriginLeft =
      -dimension.width.value / 2 + scaleOrigin.x.value;

    return {
      transform: [
        { translateX: offset.x.value },
        { translateY: offset.y.value },
        {
          translateX: transformOriginLeft,
        },
        { translateY: transformOriginTop },
        { scale: scale.value },
        {
          translateX: -transformOriginLeft,
        },
        {
          translateY: -transformOriginTop,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyles} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <PinchToZoom
        onGestureEnd={({ scale, offset }) => {
          "worklet";
          // Reset zoom and position on gesture end
          scale.value = withTiming(1);
          offset.x.value = withTiming(0);
          offset.y.value = withTiming(0);
        }}
        onDoubleTap={({ scale, offset }) => {
          "worklet";
          // zoom out if zoomed in
          if (scale.value > 1) {
            offset.x.value = withTiming(0);
            offset.y.value = withTiming(0);
            scale.value = withTiming(1);
          }
          // zoom in
          else {
            scale.value = withTiming(4);
          }
        }}
      >
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
