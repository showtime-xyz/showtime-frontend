import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgGiftSolid = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 5a3 3 0 0 1 5-2.236A3 3 0 0 1 14.83 6H16a2 2 0 1 1 0 4h-5V9a1 1 0 1 0-2 0v1H4a2 2 0 1 1 0-4h1.17C5.06 5.687 5 5.35 5 5Zm4 1V5a1 1 0 1 0-1 1h1Zm3 0a1 1 0 1 0-1-1v1h1Z"
      fill={props.color}
    />
    <Path
      d="M9 11H3v5a2 2 0 0 0 2 2h4v-7ZM11 18h4a2 2 0 0 0 2-2v-5h-6v7Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgGiftSolid;
