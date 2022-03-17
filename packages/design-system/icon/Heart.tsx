import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgHeart(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.162 3.663a5.71 5.71 0 016.224 9.315l-7.765 7.765a.878.878 0 01-1.242 0l-7.765-7.765A5.71 5.71 0 0111.69 4.9l.31.31.31-.31c.53-.53 1.16-.95 1.852-1.238zm2.186 1.322a3.953 3.953 0 00-2.796 1.158l-.93.932a.878.878 0 01-1.243 0l-.931-.931a3.954 3.954 0 00-5.592 5.591L12 18.88l7.144-7.144a3.952 3.952 0 00-1.283-6.449 3.953 3.953 0 00-1.513-.301z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgHeart;
