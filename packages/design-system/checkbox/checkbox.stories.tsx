import React from 'react'
import { Meta } from '@storybook/react'
import { Checkbox } from '../checkbox'
import { Text } from '../text'
import { View } from '../view'
import { Label } from '../label'

export default {
	component: Checkbox,
	title: 'Components/Checkbox',
} as Meta

export const Primary: React.VFC<{}> = () => {
	const [checked, setChecked] = React.useState(false)

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Label style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Checkbox accesibilityLabel="I agree" checked={checked} onChange={setChecked} />
				<Text style={{ marginLeft: 10 }}>I agree</Text>
			</Label>
		</View>
	)
}
