import { unstable_createElement } from 'react-native-web'

// https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/View/index.js#L133
const viewStyle = {
	alignItems: 'stretch',
	border: '0 solid black',
	boxSizing: 'border-box',
	display: 'flex',
	flexBasis: 'auto',
	flexDirection: 'column',
	flexShrink: 0,
	margin: 0,
	minHeight: 0,
	minWidth: 0,
	padding: 0,
	position: 'relative',
	zIndex: 0,
}

export const Label = props => unstable_createElement('label', { ...props, style: [viewStyle, props.style] })
