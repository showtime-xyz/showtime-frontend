import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgFlip = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.46 4.226a9.001 9.001 0 0 1 13.47 6.65 1 1 0 0 1-1.984.249A7.001 7.001 0 0 0 6.253 8H9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v2.34a9 9 0 0 1 2.46-2.114Zm-3.524 7.782a1 1 0 0 1 1.118.866A7.003 7.003 0 0 0 17.746 16H15a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.341a9 9 0 0 1-8.161 3.264 9.003 9.003 0 0 1-7.77-7.797 1 1 0 0 1 .867-1.118Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgFlip;
