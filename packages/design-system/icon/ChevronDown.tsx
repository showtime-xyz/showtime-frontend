import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgChevronDown(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 8.293a1 1 0 011.414 0L12 13.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgChevronDown;
