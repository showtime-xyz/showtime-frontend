import { Meta } from '@storybook/react'
import { useState } from 'react'
import { useIsDarkMode } from '../hooks'
import { View } from '../view'

import { Switch } from './index'

export default {
	component: Switch,
	title: 'Components/Switch',
} as Meta

const Container = (props: any) => {
	const isDark = useIsDarkMode()
	return <View tw={isDark ? 'bg-gray-900 p-10' : 'bg-gray-100 p-10'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => {
	const [selected, setSelected] = useState(false)
	return (
		<Container>
			<Switch checked={selected} onChange={setSelected} />
		</Container>
	)
}
