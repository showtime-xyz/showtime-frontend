import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgArrowRight(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.293 18.293a1 1 0 001.414 1.414l7-7a1 1 0 000-1.414l-7-7a1 1 0 10-1.414 1.414L16.586 11H5a1 1 0 100 2h11.586l-5.293 5.293z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgArrowRight;
