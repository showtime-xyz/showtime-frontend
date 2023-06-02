import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgCreatorChannel = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 23 25" {...props}>
    <Path
      fill={props.color}
      d="M11.235 23.825a1 1 0 1 0 1.714-1.03l-1.714 1.03Zm-3.39-5.639 3.39 5.639 1.714-1.03-3.39-5.64-1.714 1.031Z"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M18.34 4.139a3.045 3.045 0 0 1 2.807 4.227"
    />
    <Path
      stroke={props.color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7.843 8.366 1.438 12.34a.565.565 0 0 0-.259.396c-.398 2.675 1.007 5.337 3.461 6.474a.554.554 0 0 0 .516-.026l6.704-3.975a7 7 0 0 1 4.992-.833l1.232.255c.851.177 1.507-.74 1.064-1.488l-6.12-10.339c-.458-.772-1.621-.598-1.833.273l-.241.993a7 7 0 0 1-3.11 4.295Z"
    />
  </Svg>
);
export default SvgCreatorChannel;
