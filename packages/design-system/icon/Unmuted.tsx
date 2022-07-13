import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

export default function Unmuted(props: SvgProps) {
  return (
    <Svg width={23} height={16} viewBox="0 0 23 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.433.099A1 1 0 0111 1v14a1 1 0 01-1.625.78L4.65 12H1a1 1 0 01-1-1V5a1 1 0 011-1h3.65L9.374.22a1 1 0 011.058-.121zM9 3.08l-3.375 2.7A1 1 0 015 6H2v4h3a1 1 0 01.625.22L9 12.92V3.08z"
        fill={props.color}
      />
      <Path
        d="M16.247 4.753a1 1 0 10-1.414 1.414 4 4 0 010 5.656 1 1 0 101.414 1.414 6 6 0 000-8.484z"
        fill={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.247 4.753a1 1 0 10-1.414 1.414 4 4 0 010 5.656 1 1 0 101.414 1.414 6 6 0 000-8.484z"
        fill={props.color}
        strokeOpacity={0.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
