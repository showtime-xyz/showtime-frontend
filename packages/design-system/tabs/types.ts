import { TabBarProps } from 'react-native-collapsible-tab-view'

export type TabProps = {
	tabTrigger: React.ReactNode
	tabContent: React.ReactNode
	value?: string
}

export type TabsContainerProps = {
	/**
	 * Maps to aria-label on web and accessibility label on native
	 */
	accessibilityLabel?: string
	/**
	 * Default selected tab value
	 */
	defaultValue?: string
	/**
	 * Render a custom Header component
	 */
	renderHeader?: React.FC<TabBarProps>
	/**
	 * Is optional, but will optimize the first render.
	 */
	headerHeight?: number
	/**
	 * Whether tab content should be lazily mounted
	 * @default true
	 */
	lazy?: boolean
	/**
	 * Header minimum height when collapsed
	 */
	minHeaderHeight?: number
	/**
	 * Header minimum height when collapsed
	 *  @default 64
	 */
	tabBarHeight?: number
	children?: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>
}
