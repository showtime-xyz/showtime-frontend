import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgSearch(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.618 18.032a9 9 0 111.414-1.414l3.675 3.675a1 1 0 01-1.414 1.414l-3.675-3.675zM4 11a7 7 0 1112.041 4.856.998.998 0 00-.185.185A7 7 0 014 11z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgSearch;
