import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMultiple(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 5a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V6a1 1 0 00-1-1H6zm0 8a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H6zm7-7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V6zm1 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMultiple;
