import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgFilterFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 8A1.5 1.5 0 014 6.5h16a1.5 1.5 0 010 3H4A1.5 1.5 0 012.5 8zm2 4A1.5 1.5 0 016 10.5h12a1.5 1.5 0 010 3H6A1.5 1.5 0 014.5 12zM8 14.5a1.5 1.5 0 000 3h8a1.5 1.5 0 000-3H8z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgFilterFilled;
