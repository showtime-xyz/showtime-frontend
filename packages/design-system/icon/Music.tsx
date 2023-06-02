import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMusic = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.688 19.632a2.906 2.906 0 1 0 0-5.811 2.906 2.906 0 0 0 0 5.811Z"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.249 16.895V5.532c0-2.422-1.518-2.757-3.055-2.338l-5.812 1.583c-1.062.289-1.788 1.127-1.788 2.338v11.707"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.343 19.8a2.906 2.906 0 1 0 0-5.811 2.906 2.906 0 0 0 0 5.812ZM9.594 10.114l10.655-2.906"
    />
  </Svg>
);
export default SvgMusic;
