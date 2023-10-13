import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const SvgTokensTab = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <G clipPath="url(#TokensTab_svg__a)">
      <Path
        stroke={props.color}
        strokeWidth={1.059}
        d="M10 18.667a8.667 8.667 0 1 0 0-17.334 8.667 8.667 0 0 0 0 17.334Z"
      />
      <Path
        fill={props.color}
        d="M15.17 10.582a.27.27 0 0 0 0-.498l-1.47-.629a4.74 4.74 0 0 1-2.489-2.49l-.629-1.468a.27.27 0 0 0-.498 0l-.629 1.469a4.74 4.74 0 0 1-2.49 2.49l-1.468.628a.27.27 0 0 0 0 .498l1.469.63a4.74 4.74 0 0 1 2.49 2.489l.628 1.468a.27.27 0 0 0 .498 0l.63-1.468a4.74 4.74 0 0 1 2.489-2.49l1.468-.629Z"
      />
    </G>
    <Defs>
      <ClipPath id="TokensTab_svg__a">
        <Path fill={props.color} d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgTokensTab;
