import { classNames } from '@/lib/utilities'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

// Expects an array of objects with a label and a value properties
const Dropdown = ({ options, value, onChange, label }) => {
	return (
		<Listbox value={value} onChange={onChange}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm text-gray-700 dark:text-gray-500">{label}</Listbox.Label>
					<div className="mt-1 relative">
						<Listbox.Button className="bg-white dark:bg-gray-700 relative w-full border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-700 sm:text-sm">
							<span className="block truncate dark:text-gray-400">{options.filter(t => t.value === value)[0].label}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<SelectorIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options static className="z-10 absolute mt-1 w-full border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{options.map(item => (
									<Listbox.Option key={item.value} className={({ active }) => classNames(active ? 'text-white dark:text-gray-300 bg-indigo-600 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-400', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={item.value}>
										{({ active }) => (
											<>
												<span className="block truncate">{item.label}</span>

												{item.value === value ? (
													<span className={classNames(active ? 'text-white dark:text-gray-300' : 'text-indigo-600 dark:text-indigo-700', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	)
}

export default Dropdown
