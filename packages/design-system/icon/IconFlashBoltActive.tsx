import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G } from 'react-native-svg';

function IconFlashBoltActive(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14.115 20.427"
      {...props}
    >
      <Defs>
        <ClipPath id="iconFlashBoltActive_svg__a">
          <Path d="M0 0h14.117v20.426H0zm0 0" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#iconFlashBoltActive_svg__a)">
        <Path
          fill={props.color}
          d="M6.504 0L0 10.43h6.191l-5.156 9.996L13.684 8.14h-6.36L14.117 0zm0 0"
        />
      </G>
    </Svg>
  );
}

export { IconFlashBoltActive };
