import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMusicBadge = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 10 13" fill="none" {...props}>
    <Path
      d="M3.288 1.814 8.412.78a.657.657 0 0 1 .787.645l-.005 7.975c0 .863-.604 1.61-1.448 1.79l-.24.051A1.369 1.369 0 0 1 5.85 9.903c0-.633.438-1.183 1.056-1.323l1.04-.237a.744.744 0 0 0 .58-.725V4.004c0-.252-.232-.44-.478-.39l-4.268.872a.536.536 0 0 0-.428.525v5.57c0 .861-.592 1.61-1.43 1.81l-.187.044a1.406 1.406 0 0 1-1.732-1.367c0-.623.433-1.162 1.042-1.296l1.061-.233a.744.744 0 0 0 .584-.726v-6.27c0-.354.25-.66.597-.73Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgMusicBadge;
