import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgTrendingFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11c-2.678 0-5.132-.957-7.04-2.547L14 11.414V16a1 1 0 102 0V9a1 1 0 00-1-1H8a1 1 0 000 2h4.586l-9.04 9.04A10.956 10.956 0 011 12z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgTrendingFilled;
