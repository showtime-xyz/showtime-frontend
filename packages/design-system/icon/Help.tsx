import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgHelp(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.258 8.024a2 2 0 00-2.225 1.308 1 1 0 11-1.886-.664 4 4 0 017.773 1.333c0 1.53-1.135 2.54-1.945 3.081a8.044 8.044 0 01-1.686.848l-.035.013-.011.003-.004.002h-.002L11.92 13l.316.949a1 1 0 01-.633-1.897l.016-.006.074-.027a6.051 6.051 0 001.172-.6c.69-.46 1.055-.95 1.055-1.419v-.001a2 2 0 00-1.662-1.975zM11 17a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgHelp;
