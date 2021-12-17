import { Accordion as RNAccordion } from './lib'
import { ItemProps } from './lib/types'
import { View } from 'design-system/view'
import { MotiView } from 'moti'
import { Easing } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import { useContext } from 'react'
import { Text, Props as TextProps } from 'design-system/text'
import { ViewProps } from 'design-system/view'

const Chevron = () => {
	const { value: selectedValue } = useContext(RNAccordion.RootContext)
	const itemValue = useContext(RNAccordion.ItemContext)
	const isExpanded = itemValue === selectedValue

	return (
		<MotiView
			animate={{
				rotateZ: isExpanded ? '0deg' : '180deg',
			}}
			transition={{ type: 'timing', duration: 500, easing: Easing.bezier(0.87, 0, 0.13, 1) }}
		>
			<Svg width={14} height={8} fill="none">
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M13.707 7.707a1 1 0 0 1-1.414 0L7 2.414 1.707 7.707A1 1 0 0 1 .293 6.293l6-6a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414Z"
					fill="#18181B"
				/>
			</Svg>
		</MotiView>
	)
}

const Item = ({ tw = '', disabled, ...props }: ViewProps & ItemProps) => {
	return (
		<RNAccordion.Item value={props.value} disabled={disabled}>
			<View tw={`bg-white dark:bg-black rounded-2xl ${disabled ? 'opacity-60 ' : ''} ${tw}`} {...props} />
		</RNAccordion.Item>
	)
}

const Trigger = ({ tw = '', ...props }: ViewProps) => {
	return (
		<RNAccordion.Trigger>
			<View tw={'px-4 py-5 flex-row items-center justify-between w-full ' + tw} {...props}>
				{props.children}
				<Chevron />
			</View>
		</RNAccordion.Trigger>
	)
}

const Content = ({ tw = '', ...props }: ViewProps) => {
	return (
		<RNAccordion.Content>
			<View tw={'p-4 ' + tw} {...props} />
		</RNAccordion.Content>
	)
}

const Label = ({ tw = '', ...props }: TextProps) => {
	return <Text tw={'font-bold ' + tw} {...props} />
}

export const Accordion = {
	Root: RNAccordion.Root,
	Item,
	Trigger,
	Content,
	Label,
}
