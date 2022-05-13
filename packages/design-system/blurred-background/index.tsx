import { Canvas, Paint, Blur, Fill } from "@shopify/react-native-skia";

type BlurTint = "light" | "dark" | "default";

function getBackgroundColor(intensity: number, tint: BlurTint): string {
  const opacity = intensity / 100;
  switch (tint) {
    case "dark":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(25,25,25,${opacity * 0.78})`;
    case "light":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(249,249,249,${opacity * 0.78})`;
    case "default":
      // From xcode composition
      return `rgba(255,255,255,${opacity * 0.3})`;
  }
}

type Props = {
  isDark: boolean;
  width: number;
  height: number;
};

function BlurredBackground({ isDark }: Props) {
  return (
    <Canvas style={{ flex: 1, marginBottom: -1 }}>
      <Paint color={getBackgroundColor(95, isDark ? "dark" : "light")}>
        <Blur sigmaX={20} sigmaY={20} />
      </Paint>
      <Fill />
    </Canvas>
  );
}

export { BlurredBackground };
