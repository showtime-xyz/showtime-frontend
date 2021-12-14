import { Meta } from '@storybook/react'
import { useIsDarkMode } from '../hooks'
import { View } from '../view'

import { VerificationBadge } from './index'

export default {
	component: VerificationBadge,
	title: 'Components/VerificationBadge',
} as Meta

const Container = (props: any) => {
	const isDark = useIsDarkMode()
	return <View tw={isDark ? 'bg-gray-900 p-10' : 'bg-gray-100 p-10'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => {
	return (
		<Container>
			<VerificationBadge />
		</Container>
	)
}
