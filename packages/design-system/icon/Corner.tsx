import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgCorner(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.293 9.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L18.586 15l-4.293-4.293a1 1 0 010-1.414z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3a1 1 0 011 1v7a3 3 0 003 3h12a1 1 0 110 2H8a5 5 0 01-5-5V4a1 1 0 011-1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgCorner;
