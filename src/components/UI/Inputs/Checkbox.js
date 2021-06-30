import CheckIcon from '@/components/Icons/CheckIcon'

const Checkbox = ({ label, value, onChange, position = 'left', className }) => {
	return (
		<button type="button" onClick={() => onChange(!value)} className={`flex ${position == 'left' ? '' : 'flex-row-reverse'} items-center group ${className}`}>
			<div className="text-gray-800 dark:text-gray-200 border-gray-300 rounded bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-700 transition p-1 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-indigo-500">
				<CheckIcon className={`w-3 h-3 transition ${value ? 'opacity-100' : 'opacity-0'}`} />
			</div>
			<p className={`font-medium dark:text-gray-400 ${position == 'left' ? 'ml-2' : 'mr-2'}`}>{label}</p>
		</button>
	)
}

export default Checkbox
