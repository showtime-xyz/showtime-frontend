import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

const SvgWcLogo = (props: SvgProps) => (
  <Svg width={96} height={64} fill="none" viewBox="0 0 96 64" {...props}>
    <G clipPath="url(#WCLogo_svg__a)">
      <Path
        fill={props.fill || "#fff"}
        d="M25.323 17.597c12.524-12.262 32.83-12.262 45.354 0l1.508 1.476a1.547 1.547 0 0 1 0 2.22l-5.157 5.049a.814.814 0 0 1-1.133 0L63.82 24.31c-8.737-8.555-22.903-8.555-31.64 0l-2.222 2.175a.814.814 0 0 1-1.134 0l-5.156-5.049a1.547 1.547 0 0 1 0-2.22l1.655-1.62Zm56.018 10.44 4.59 4.494a1.547 1.547 0 0 1 0 2.22l-20.693 20.26a1.628 1.628 0 0 1-2.268 0L48.284 40.633a.407.407 0 0 0-.567 0L33.03 55.012a1.628 1.628 0 0 1-2.268 0L10.07 34.751a1.547 1.547 0 0 1 0-2.221l4.589-4.493a1.628 1.628 0 0 1 2.268 0l14.686 14.38a.41.41 0 0 0 .567 0l14.686-14.38a1.628 1.628 0 0 1 2.268 0l14.686 14.38a.41.41 0 0 0 .567 0l14.686-14.38a1.628 1.628 0 0 1 2.268 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="WCLogo_svg__a">
        <Path fill={props.fill || "#fff"} d="M0 0h96v64H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgWcLogo;
