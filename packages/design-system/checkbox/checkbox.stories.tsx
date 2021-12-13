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
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Checkbox id="checkbox" accesibilityLabel="I agree" checked={checked} onChange={setChecked} />
				<Label htmlFor="checkbox" sx={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
					I agree
				</Label>
			</View>
		</View>
	)
}
