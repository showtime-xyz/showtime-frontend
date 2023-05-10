import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMusicDropType = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.4 21.66c1.988 0 3.6-1.541 3.6-3.443 0-1.901-1.612-3.443-3.6-3.443s-3.6 1.542-3.6 3.443c0 1.902 1.612 3.444 3.6 3.444Z"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M22.2 18.417V4.952c0-2.87-1.88-3.267-3.785-2.77l-7.2 1.876C9.9 4.4 9 5.393 9 6.828v10.866"
    />
    <Path
      fill={props.color}
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.6 21.86c1.988 0 3.6-1.541 3.6-3.443 0-1.902-1.612-3.444-3.6-3.444S15 16.515 15 18.418s1.612 3.443 3.6 3.443ZM21.242 6.614 9 9.808l.534-.603V5.934l.716-1.247 7.916-2.212h1.173l1.205.685.489 1.527.21 1.927Z"
    />
  </Svg>
);
export default SvgMusicDropType;
