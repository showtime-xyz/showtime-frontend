import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgArrowLeft(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.707 5.707a1 1 0 00-1.414-1.414l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L7.414 13H19a1 1 0 100-2H7.414l5.293-5.293z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgArrowLeft;
