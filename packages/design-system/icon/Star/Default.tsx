import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

function SvgDefault(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.963 2.596a1.2 1.2 0 012.074 0l2.838 4.873 5.512 1.193a1.2 1.2 0 01.64 1.973L18.27 14.84l.568 5.61a1.2 1.2 0 01-1.678 1.22L12 19.394 6.84 21.67a1.2 1.2 0 01-1.678-1.219l.568-5.61-3.757-4.205a1.2 1.2 0 01.64-1.973L8.125 7.47l2.838-4.873z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgDefault;
