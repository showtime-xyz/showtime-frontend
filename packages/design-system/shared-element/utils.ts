import { TransformsStyle } from "react-native";

import { measure, AnimatedRef, useSharedValue } from "react-native-reanimated";

import { Measurements } from "./SharedElementContext";

export function calculateRectangleDimensions(
  Wb: number,
  Hb: number,
  angleRadians: number
) {
  "worklet";
  // Convert angle to radians

  // Calculate sin and cos values
  const sinTheta = Math.abs(Math.sin(angleRadians));
  const cosTheta = Math.abs(Math.cos(angleRadians));

  // Calculate sin^2 and cos^2 values
  const sinSquaredTheta = Math.pow(sinTheta, 2);
  const cosSquaredTheta = Math.pow(cosTheta, 2);

  // Calculate original width and height of the rectangle
  const H =
    (Wb * sinTheta - Hb * cosTheta) / (sinSquaredTheta - cosSquaredTheta);
  const W = (Wb - H * sinTheta) / cosTheta;

  // Return the width and height as an object
  return { width: W, height: H };
}

type RNTransform = Exclude<TransformsStyle["transform"], undefined>;
type Vector = {
  x: number;
  y: number;
};

export const transformOrigin = (
  { x, y }: Vector,
  transformations: RNTransform
): RNTransform => {
  "worklet";
  return ([{ translateX: x }, { translateY: y }] as RNTransform)
    .concat(transformations)
    .concat([{ translateX: -x }, { translateY: -y }]);
};

export function measureAsync(
  ref: AnimatedRef<any>,
  callback: (measurements: Measurements) => void
) {
  "worklet";

  const tryMeasure = () => {
    requestAnimationFrame(() => {
      const res = measure(ref);

      if (res == null || res.width === 0 || res.height === 0) {
        tryMeasure();
        return;
      }

      callback(res);
    });
  };

  tryMeasure();
}
