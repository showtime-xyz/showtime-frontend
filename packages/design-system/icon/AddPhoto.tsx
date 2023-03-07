import * as React from "react";

import Svg, { SvgProps, Mask, Path, G } from "react-native-svg";

const SvgAddPhoto = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="AddPhoto_svg__a"
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <Path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </Mask>
    <G mask="url(#AddPhoto_svg__a)">
      <Path
        d="M4.222 22a2.14 2.14 0 0 1-1.57-.653A2.14 2.14 0 0 1 2 19.777V4.223c0-.61.218-1.134.653-1.57A2.14 2.14 0 0 1 4.223 2h10v2.222h-10v15.556h15.555v-10H22v10a2.14 2.14 0 0 1-.653 1.57 2.14 2.14 0 0 1-1.57.652H4.223ZM17.556 8.667V6.444h-2.223V4.222h2.223V2h2.222v2.222H22v2.222h-2.222v2.223h-2.222ZM5.333 17.556h13.334L14.5 12l-3.333 4.444-2.5-3.333-3.334 4.445Z"
        fill={props.color}
      />
    </G>
  </Svg>
);

export default SvgAddPhoto;
