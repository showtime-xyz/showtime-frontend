const Button = ({ style, ...props }) => {
	switch (style) {
		case 'primary':
			return <PrimaryButton {...props} />

		case 'tertiary':
			return <TertiaryButton {...props} />

		case 'tertiary_gray':
			return <TertiaryGrayButton {...props} />

		default:
			throw new Error('No style specified')
	}
}

export const BaseButton = props => {
	const Component = props.as || 'button'

	return <Component {...props} />
}

export const PrimaryButton = ({ className, ...props }) => <BaseButton {...props} className={`border-2 border-transparent dark:border-white bg-black text-white font-medium dark:bg-transparent rounded-2xl flex items-center px-4 py-2 ${className}`} />

export const TertiaryButton = ({ className, ...props }) => <BaseButton {...props} className={`relative border border-transparent bg-white dark:bg-gray-900 rounded-2xl flex items-center px-4 py-2 before:absolute before:inset-0 before:z-[-1] before:rounded-inherit before:bg-gradient-to-r before:from-[#4DEAFF] before:to-[#894DFF] before:m-[-2px] ${className}`} />

export const TertiaryGrayButton = ({ className, ...props }) => <BaseButton {...props} className={`relative border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl flex items-center px-4 py-2 ${className}`} />

export default Button
