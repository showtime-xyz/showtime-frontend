import * as React from "react";

import Svg, { SvgProps, Rect, Path, G } from "react-native-svg";

const SvgCreate = (
  props: SvgProps & { isDark?: boolean; crossColor?: string }
) => (
  <Svg width={24} height={24} viewBox="0 0 34 24" {...props}>
    <Rect
      width={23}
      height={23}
      y={0.25}
      fill={props.color ?? "#ff3370"}
      rx={3}
    />
    <Path
      fill={props.color ?? "#ff3370"}
      d="M21.675 12.616a1 1 0 0 1 0-1.732l10.356-5.98a1 1 0 0 1 1.5.867v11.958a1 1 0 0 1-1.5.866z"
    />
    <G
      stroke={
        props.crossColor
          ? props.crossColor
          : props.isDark
          ? "#000000"
          : "#ffffff"
      }
      strokeWidth={2}
    >
      <Path d="M11.5 6.723v10.053M6.473 11.75h10.053" />
    </G>
  </Svg>
);
export default SvgCreate;
