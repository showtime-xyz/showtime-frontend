import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgAccessTicket = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 15 10" {...props}>
    <Path
      fill={props.color}
      d="M.88 2.63a.5.5 0 1 0 0 1v-1ZM13.277.23H1.835v1h11.442v-1Zm1.5 2.9v-1.4h-1v1.4h1Zm-1.67 1.67c0-.647.524-1.17 1.17-1.17v-1a2.17 2.17 0 0 0-2.17 2.17h1Zm1.17 1.17a1.17 1.17 0 0 1-1.17-1.17h-1a2.17 2.17 0 0 0 2.17 2.17v-1Zm.5 1.9v-1.4h-1v1.4h1ZM1.835 9.37h11.442v-1H1.835v1Zm-1.5-2.857V7.87h1V6.513h-1ZM2.05 4.8A1.17 1.17 0 0 1 .88 5.97v1A2.17 2.17 0 0 0 3.05 4.8h-1ZM.88 3.63c.646 0 1.17.524 1.17 1.17h1A2.17 2.17 0 0 0 .88 2.63v1Zm-.545-1.9v1.356h1V1.729h-1Zm1 4.784c0 .26-.212.456-.455.456v-1a.545.545 0 0 0-.545.544h1Zm.5 1.856a.5.5 0 0 1-.5-.5h-1a1.5 1.5 0 0 0 1.5 1.5v-1Zm11.942-.5a.5.5 0 0 1-.5.5v1a1.5 1.5 0 0 0 1.5-1.5h-1ZM.88 2.63c.243 0 .455.196.455.456h-1c0 .31.253.544.545.544v-1Zm12.897.5a.5.5 0 0 1 .5-.5v1a.5.5 0 0 0 .5-.5h-1Zm.5 3.84a.5.5 0 0 1-.5-.5h1a.5.5 0 0 0-.5-.5v1ZM1.835.23a1.5 1.5 0 0 0-1.5 1.5h1a.5.5 0 0 1 .5-.5v-1Zm11.442 1a.5.5 0 0 1 .5.5h1a1.5 1.5 0 0 0-1.5-1.5v1Z"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.623 1.042v1.097M9.623 4.304v.99M9.623 7.43v1.126"
    />
  </Svg>
);
export default SvgAccessTicket;
