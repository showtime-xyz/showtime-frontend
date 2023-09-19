import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgDownload3 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M6.951 10.927a1.143 1.143 0 0 0-1.616 1.616l6.019 6.018c.446.447 1.17.447 1.616 0l6.018-6.018a1.143 1.143 0 0 0-1.616-1.616l-4.068 4.067V2.273a1.143 1.143 0 1 0-2.285 0v12.721L6.95 10.927Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1.5 20.625a2.22 2.22 0 0 0 2.22 2.22H19.88a2.22 2.22 0 0 0 2.22-2.22"
    />
  </Svg>
);
export default SvgDownload3;
