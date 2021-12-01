import CheckIcon from '@/components/Icons/CheckIcon'

const Checkbox = ({ children, value, onChange, position = 'left', className }) => {
	return (
		<button
			type="button"
			onClick={() => onChange(!value)}
			className={`flex ${position == 'left' ? '' : 'flex-row-reverse'} items-center group ${className}`}
		>
			<div className="text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded bg-gray-100 dark:bg-black transition p-1 group-focus-visible:ring">
				<CheckIcon className={`w-3 h-3 transition ${value ? 'opacity-100' : 'opacity-0'}`} />
			</div>
			<p
				className={`text-sm font-medium text-gray-700 dark:text-gray-300 text-left ${
					position == 'left' ? 'ml-2' : 'mr-2'
				}`}
			>
				{children}
			</p>
		</button>
	)
}

export default Checkbox
