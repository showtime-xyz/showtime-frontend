import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgBackward = (props: SvgProps) => (
  <Svg width={10} height={18} viewBox="0 0 10 18" fill="none" {...props}>
    <Path
      fill={props.fill || '#fff'}
      fillRule="evenodd"
      d="M8.735.179a.75.75 0 0 1 .087 1.057L2.92 8.192a1.25 1.25 0 0 0 0 1.617l5.902 6.956a.75.75 0 1 1-1.144.97L1.776 10.78a2.75 2.75 0 0 1 0-3.559L7.678.265A.75.75 0 0 1 8.735.18Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgBackward;
