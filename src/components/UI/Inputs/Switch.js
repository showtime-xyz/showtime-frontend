import { classNames } from '../../../lib/utilities'
import { Switch as HeadlessSwitch } from '@headlessui/react'

const Switch = ({ value, onChange }) => {
	return (
		<HeadlessSwitch checked={value} onChange={onChange} className={classNames(value ? 'bg-gradient-to-r from-[#4D54FF] dark:from-[#4DEAFF] to-[#E14DFF] dark:to-[#894DFF]' : 'bg-gray-200 dark:bg-gray-700', 'relative inline-flex flex-shrink-0 h-6 w-11 p-[2px] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500')}>
			<span aria-hidden="true" className={classNames(value ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-black shadow transform ring-0 transition ease-in-out duration-200')} />
		</HeadlessSwitch>
	)
}

export default Switch
