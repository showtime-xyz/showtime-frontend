import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMenu = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.024 3H2.976A.988.988 0 0 0 2 4c0 .552.437 1 .976 1h18.048A.988.988 0 0 0 22 4c0-.552-.437-1-.976-1ZM21.024 11H2.976A.988.988 0 0 0 2 12c0 .552.437 1 .976 1h18.048A.988.988 0 0 0 22 12c0-.552-.437-1-.976-1ZM21.024 19H2.976A.988.988 0 0 0 2 20c0 .552.437 1 .976 1h18.048A.988.988 0 0 0 22 20c0-.552-.437-1-.976-1Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgMenu;
