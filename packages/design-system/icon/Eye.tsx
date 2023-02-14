import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgEye = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path
      d="M29.791 15.389C25.898 10.348 21.517 8 16 8s-9.898 2.348-13.791 7.389c-.278.36-.278.862 0 1.222C6.102 21.652 10.484 24 16 24s9.898-2.348 13.791-7.389c.278-.36.278-.862 0-1.222zM16 22c-4.688 0-8.33-1.857-11.723-6C7.67 11.857 11.312 10 16 10s8.33 1.857 11.723 6C24.33 20.143 20.688 22 16 22z"
      fill={props.color}
    />
    <Path
      d="M16 12c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"
      fill={props.color}
    />
  </Svg>
);

export default SvgEye;
