import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgLayers(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.553 1.106a1 1 0 01.894 0l10 5a1 1 0 010 1.788l-10 5a1 1 0 01-.894 0l-10-5a1 1 0 010-1.788l10-5zM4.236 7L12 10.882 19.764 7 12 3.118 4.236 7zm-3.13 9.553a1 1 0 011.341-.447L12 20.882l9.553-4.776a1 1 0 11.894 1.788l-10 5a1 1 0 01-.894 0l-10-5a1 1 0 01-.447-1.341zm1.341-5.447a1 1 0 10-.894 1.788l10 5a1 1 0 00.894 0l10-5a1 1 0 10-.894-1.788L12 15.882l-9.553-4.776z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgLayers;
