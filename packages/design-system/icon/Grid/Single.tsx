import * as React from 'react'
import Svg, { SvgProps, Rect } from 'react-native-svg'

function SvgSingle(props: SvgProps) {
	return (
		<Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
			<Rect x={5} y={4} width={14} height={16} rx={2} fill={props.color} />
		</Svg>
	)
}

export default SvgSingle
