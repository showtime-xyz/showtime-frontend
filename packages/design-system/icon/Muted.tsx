import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

export default function Muted(props: SvgProps) {
  return (
    <Svg width={23} height={16} viewBox="0 0 23 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.433.099A1 1 0 0111 1v14a1 1 0 01-1.625.78L4.65 12H1a1 1 0 01-1-1V5a1 1 0 011-1h3.65L9.374.22a1 1 0 011.058-.121zM9 3.08l-3.375 2.7A1 1 0 015 6H2v4h3a1 1 0 01.625.22L9 12.92V3.08z"
        fill={props.color}
      />
      <Path
        d="M19 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L17.586 8l-2.293-2.293a1 1 0 011.414-1.414L19 6.586l2.293-2.293a1 1 0 111.414 1.414L20.414 8l2.293 2.293a1 1 0 01-1.414 1.414L19 9.414z"
        fill={props.color}
      />
    </Svg>
  );
}
