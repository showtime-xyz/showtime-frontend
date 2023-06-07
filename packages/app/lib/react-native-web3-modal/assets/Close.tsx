import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgClose = (props: SvgProps) => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" {...props}>
    <Path
      fill={props.fill || '#fff'}
      d="M9.94 11A.75.75 0 1 0 11 9.94L7.414 6.353a.5.5 0 0 1 0-.708L11 2.061A.75.75 0 1 0 9.94 1L6.353 4.586a.5.5 0 0 1-.708 0L2.061 1A.75.75 0 0 0 1 2.06l3.586 3.586a.5.5 0 0 1 0 .708L1 9.939A.75.75 0 1 0 2.06 11l3.586-3.586a.5.5 0 0 1 .708 0L9.939 11Z"
    />
  </Svg>
);

export default SvgClose;
