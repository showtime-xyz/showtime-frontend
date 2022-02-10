import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgChevronRight(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.293 18.707a1 1 0 010-1.414L13.586 12 8.293 6.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgChevronRight;
