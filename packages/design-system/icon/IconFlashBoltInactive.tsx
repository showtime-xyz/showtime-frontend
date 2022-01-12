import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G } from 'react-native-svg';

function IconFlashBoltInactive(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 23.775 23.798"
      {...props}
    >
      <Defs>
        <ClipPath id="iconFlashBoltInactive_svg__a">
          <Path d="M0 0h23.773v23.797H0zm0 0" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#iconFlashBoltInactive_svg__a)">
        <Path
          d="M1.66 0l5.781 5.758-1.273 2.07L0 1.66A13.33 13.33 0 011.66 0zm9.684 2.48L4.84 12.91h6.191L5.88 22.906l12.644-12.285h-6.359l6.793-8.14zm3.422 13.973l7.347 7.344a13.33 13.33 0 001.66-1.66l-7.296-7.348zm0 0"
          fillRule="evenodd"
          fill={props.color}
        />
      </G>
    </Svg>
  );
}

export { IconFlashBoltInactive };
