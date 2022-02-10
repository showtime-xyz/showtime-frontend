import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgChevronUp(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.707 15.707a1 1 0 01-1.414 0L12 10.414l-5.293 5.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 010 1.414z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgChevronUp;
