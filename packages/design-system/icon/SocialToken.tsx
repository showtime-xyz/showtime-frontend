import * as React from "react";

import Svg, {
  SvgProps,
  G,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgSocialToken(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <G clipPath="url(#Social_Token_svg__clip0_752:19)">
        <Path
          d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z"
          fill="url(#Social_Token_svg__paint0_linear_752:19)"
        />
        <Path fill="#F59E0B" d="M-.856 21.732l27.713-16 2 3.464-27.713 16z" />
        <Path
          fill="#FCD34D"
          d="M-4.856 14.804l27.713-16 1.5 2.598-27.713 16z"
        />
        <G>
          <Rect
            x={4}
            y={4}
            width={16}
            height={16}
            rx={8}
            fill="#FBBF24"
            fillOpacity={0.6}
          />
          <Rect
            x={4.5}
            y={4.5}
            width={15}
            height={15}
            rx={7.5}
            stroke="url(#Social_Token_svg__paint1_linear_752:19)"
          />
        </G>
        <Path
          d="M7.04 3.029c-.012-.039-.068-.039-.08 0A5.806 5.806 0 013.03 6.96c-.039.011-.039.067 0 .078a5.806 5.806 0 013.932 3.933c.011.037.067.037.078 0a5.806 5.806 0 013.933-3.933c.037-.011.037-.067 0-.078a5.806 5.806 0 01-3.933-3.932zM12.02 2.014c-.006-.019-.034-.019-.04 0a2.903 2.903 0 01-1.966 1.966c-.019.006-.019.034 0 .04a2.903 2.903 0 011.966 1.966c.006.019.034.019.04 0a2.903 2.903 0 011.966-1.966c.019-.006.019-.034 0-.04a2.903 2.903 0 01-1.966-1.966z"
          fill="#FFFBEB"
        />
      </G>
      <Path
        d="M12 23C5.925 23 1 18.075 1 12h-2c0 7.18 5.82 13 13 13v-2zm11-11c0 6.075-4.925 11-11 11v2c7.18 0 13-5.82 13-13h-2zM12 1c6.075 0 11 4.925 11 11h2c0-7.18-5.82-13-13-13v2zm0-2C4.82-1-1 4.82-1 12h2C1 5.925 5.925 1 12 1v-2z"
        fill="#F59E0B"
      />
      <Defs>
        <LinearGradient
          id="Social_Token_svg__paint0_linear_752:19"
          x1={24}
          y1={0}
          x2={0}
          y2={24}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFBEB" />
          <Stop offset={0.234} stopColor="#FDE68A" />
          <Stop offset={0.693} stopColor="#F59E0B" />
        </LinearGradient>
        <LinearGradient
          id="Social_Token_svg__paint1_linear_752:19"
          x1={20}
          y1={4}
          x2={4}
          y2={20}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFBEB" />
          <Stop offset={0.234} stopColor="#FDE68A" />
          <Stop offset={0.693} stopColor="#F59E0B" />
        </LinearGradient>
        <ClipPath id="Social_Token_svg__clip0_752:19">
          <Path
            d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z"
            fill={props.color}
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgSocialToken;
