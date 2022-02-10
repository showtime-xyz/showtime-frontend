import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.963 2.596a1.2 1.2 0 012.074 0l2.838 4.873 5.512 1.193a1.2 1.2 0 01.64 1.973L18.27 14.84l.568 5.61a1.2 1.2 0 01-1.678 1.22L12 19.394 6.84 21.67a1.2 1.2 0 01-1.678-1.219l.568-5.61-3.757-4.205a1.2 1.2 0 01.64-1.973L8.125 7.47l2.838-4.873zM12 4.79L9.676 8.78a1.2 1.2 0 01-.783.569l-4.514.977 3.077 3.444a1.2 1.2 0 01.3.92l-.466 4.595 4.226-1.862a1.2 1.2 0 01.968 0l4.226 1.862-.465-4.594a1.2 1.2 0 01.299-.92l3.077-3.445-4.514-.977a1.2 1.2 0 01-.783-.569L12 4.79z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgFilled;
