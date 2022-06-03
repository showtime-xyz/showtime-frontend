import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgFlashOff = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.974 1.734a.877.877 0 1 0-1.24 1.24l5.572 5.572-3.872 4.647a.877.877 0 0 0 .674 1.438h6.899l-.754 6.03a.877.877 0 0 0 1.544.67l3.77-4.524 5.46 5.46a.877.877 0 1 0 1.24-1.24l-6.132-6.132-.013-.013L9.12 7.88a.84.84 0 0 0-.014-.014L2.974 1.734ZM8.55 9.79 5.98 12.877h5.657L8.55 9.79Zm4.292 4.292-.479 3.827 1.957-2.348-1.478-1.48Z"
      fill={props.color}
    />
    <Path
      d="M13.747 3.339a.877.877 0 0 0-1.544-.67L10.072 5.23a.877.877 0 0 0 1.348 1.122l.218-.262-.149 1.198a.877.877 0 1 0 1.74.216l.518-4.165ZM15.21 9.37a.877.877 0 0 0 0 1.753h2.808l-.93 1.113a.877.877 0 0 0 1.347 1.124l2.13-2.552a.877.877 0 0 0-.673-1.439H15.21Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgFlashOff;
