import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgWallet(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 6a3 3 0 013-3h13a3 3 0 013 3v1a3 3 0 013 3v4a3 3 0 01-3 3v1a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm17 0v1h-2a3 3 0 00-3 3v4a3 3 0 003 3h2v1a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1h13a1 1 0 011 1zm-2 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4zm1 2a1 1 0 100 2h1a1 1 0 100-2h-1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgWallet;
