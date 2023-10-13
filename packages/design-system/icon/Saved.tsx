import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgSavedTab = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 14 18" {...props}>
    <Path
      stroke={props.color}
      strokeWidth={0.801}
      d="M11.381 16.278a.673.673 0 0 0 1.069-.545V2.928c0-.565-.422-1.022-.943-1.022H2.075c-.521 0-.944.457-.944 1.022v12.805c0 .55.624.868 1.07.545l3.976-2.887c.354-.238.899-.238 1.228 0l3.976 2.887Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.color}
      strokeWidth={0.801}
      d="M11.381 15.49a.673.673 0 0 0 1.069-.545V2.14c0-.564-.422-1.021-.943-1.021H2.075c-.521 0-.944.457-.944 1.021v12.806c0 .55.624.868 1.07.545l3.976-2.887c.354-.238.899-.238 1.228 0l3.976 2.887Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgSavedTab;
