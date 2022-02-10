import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgImage(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v7.586l-3.293-3.293a1 1 0 00-1.414 0L4.649 19.937A1 1 0 014 19V5zm1.001 17H19a3 3 0 003-3v-3.999V5a3 3 0 00-3-3H5a3 3 0 00-3 3v14a3 3 0 002.999 3M20 15.414V19a1 1 0 01-1 1H7.414L16 11.414l4 4zM8.5 8a.5.5 0 100 1 .5.5 0 000-1zM6 8.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgImage;
