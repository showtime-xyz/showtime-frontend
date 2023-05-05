import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const SvgMusicDropType = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#MusicDropType_svg__a)"
    >
      <Path
        fill={props.color}
        d="M4.952 22.05c2.074 0 3.756-1.608 3.756-3.592s-1.682-3.592-3.756-3.592-3.755 1.608-3.755 3.592 1.681 3.592 3.755 3.592Z"
      />
      <Path d="M22.477 18.666V4.621c0-2.993-1.962-3.408-3.948-2.89l-7.51 1.957c-1.373.357-2.311 1.393-2.311 2.89v11.335" />
      <Path
        fill={props.color}
        d="M18.721 22.259c2.074 0 3.756-1.609 3.756-3.592 0-1.984-1.682-3.592-3.756-3.592s-3.755 1.608-3.755 3.592c0 1.983 1.681 3.591 3.755 3.591ZM22.477 6.693l-13.77 3.592.6-.678v-3.68l.807-1.402 8.903-2.488h1.32l1.355.771.55 1.717.235 2.168Z"
      />
    </G>
    <Defs>
      <ClipPath id="MusicDropType_svg__a">
        <Path fill={props.color} d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgMusicDropType;
