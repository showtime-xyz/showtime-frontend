import * as React from "react";

import Svg, { SvgProps, Path, Circle } from "react-native-svg";

function SvgReaction(props: SvgProps) {
  const { color, ...rest } = props;
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...rest}>
      <Path
        d="M15.266 7.795a7.158 7.158 0 11-4.938-4.602M15.229 1.272v4.21M13.123 3.377h4.211"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M5.356 12.48c.35.434.833.769 1.376.993.545.224 1.151.338 1.76.338s1.215-.114 1.76-.338c.543-.224 1.025-.559 1.376-.993"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle
        cx={6.10587}
        cy={8.52335}
        r={0.795322}
        fill="#909090"
        stroke={color}
        strokeWidth={0.795322}
        strokeLinecap="round"
      />
      <Circle
        cx={10.8778}
        cy={8.52335}
        r={0.795322}
        fill="#909090"
        stroke={color}
        strokeWidth={0.795322}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SvgReaction;
