import { unstable_createElement } from 'react-native-web'

// https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/View/index.js#L133
const textStyle = {
	border: '0 solid black',
	boxSizing: 'border-box',
	color: 'black',
	display: 'inline',
	font: '14px System',
	margin: 0,
	padding: 0,
	whiteSpace: 'pre-wrap',
	wordWrap: 'break-word',
}

export const Label = props => unstable_createElement('label', { ...props, style: [textStyle, props.style] })
