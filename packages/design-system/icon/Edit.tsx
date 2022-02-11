import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgEdit(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.207 3.207a1.121 1.121 0 011.586 1.586l-9.304 9.304-2.115.529.529-2.115 9.304-9.304zM20 .88c-.828 0-1.622.329-2.207.914l-9.5 9.5a1 1 0 00-.263.465l-1 4a1 1 0 001.213 1.212l4-1a.999.999 0 00.464-.263l9.5-9.5A3.121 3.121 0 0020 .88zM4 3a3 3 0 00-3 3v14a3 3 0 003 3h14a3 3 0 003-3v-7a1 1 0 10-2 0v7a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1h7a1 1 0 100-2H4z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgEdit;
