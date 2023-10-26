import * as React from "react";

import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

const SvgInviteTicket = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 135 66" {...props}>
    <Path
      fill="url(#InviteTicket_svg__a)"
      fillRule="evenodd"
      d="M84.564.128v2.566h2V.128h39.883a8 8 0 0 1 8 8v16.707c0 .367-.316.651-.683.651a7.092 7.092 0 1 0 0 14.184c.367 0 .683.285.683.652V57.03a8 8 0 0 1-8 8H8.344a8 8 0 0 1-8-8V41.194c0-.88.835-1.524 1.715-1.524a7.092 7.092 0 0 0 0-14.184c-.88 0-1.715-.643-1.715-1.523V8.128a8 8 0 0 1 8-8h76.22Zm0 7.967v5.4h2v-5.4h-2Zm0 10.801v5.4h2v-5.4h-2Zm0 10.802v5.4h2v-5.4h-2Zm0 10.801v5.4h2v-5.4h-2Zm0 10.801v5.401h2v-5.4h-2Zm0 10.802v2.7h2v-2.7h-2Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="InviteTicket_svg__a"
        x1={518.543}
        x2={402.786}
        y1={-51.667}
        y2={-229.991}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.021} stopColor="#FFCB6C" />
        <Stop offset={0.049} stopColor="#FDD764" />
        <Stop offset={0.124} stopColor="#FFD24D" />
        <Stop offset={0.155} stopColor="#E6A130" />
        <Stop offset={0.172} stopColor="#EDAF38" />
        <Stop offset={0.191} stopColor="#FFE956" />
        <Stop offset={0.222} stopColor="#FFEC92" />
        <Stop offset={0.26} stopColor="#FED749" />
        <Stop offset={0.313} stopColor="#FDC93F" />
        <Stop offset={0.362} stopColor="#F6C33D" />
        <Stop offset={0.404} stopColor="#ED9F26" />
        <Stop offset={0.464} stopColor="#E88A3F" />
        <Stop offset={0.541} stopColor="#F4CE5E" />
        <Stop offset={0.609} stopColor="#E4973C" />
        <Stop offset={0.696} stopColor="#F1A819" />
        <Stop offset={0.824} stopColor="#FFD480" />
        <Stop offset={0.918} stopColor="#FBC73F" />
        <Stop offset={0.998} stopColor="#F5E794" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SvgInviteTicket;
