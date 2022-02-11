import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgFilter(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 8a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1zm3 3a1 1 0 100 2h8a1 1 0 100-2H8z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgFilter;
