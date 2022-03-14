import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function PlusFilled(props: SvgProps) {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1.167a7.333 7.333 0 100 14.666A7.333 7.333 0 008 1.167zm0 3a1 1 0 011 1V7.5h2.334a1 1 0 010 2H9v2.333a1 1 0 01-2 0V9.5H4.667a1 1 0 110-2H7V5.167a1 1 0 011-1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default PlusFilled;
