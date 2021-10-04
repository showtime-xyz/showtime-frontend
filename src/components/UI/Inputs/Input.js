const Input = ({ label, labelSubtitle, id, value, onChange, className = '', Icon, ...props }) => {
	return (
		<div className={className}>
			<label className={`block dark:text-gray-300 mb-1 text-sm font-bold ${labelSubtitle && 'flex items-center'}`} htmlFor={id}>
				{label}
				{labelSubtitle}
			</label>
			<div className="relative">
				<input value={value} onChange={event => onChange(event.target.value)} className={`border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 px-4 py-3 ${Icon && 'pr-10'} rounded-2xl w-full font-medium focus:outline-none`} id={id} {...props} />
				{Icon && <Icon className="w-4 h-4 dark:text-gray-400 absolute top-4 right-4" />}
			</div>
		</div>
	)
}

export default Input
