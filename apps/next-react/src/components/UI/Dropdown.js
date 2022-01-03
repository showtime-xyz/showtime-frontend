import { classNames } from "@/lib/utilities";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ChevronDown from "../Icons/ChevronDown";

// Expects an array of objects with a label and a value properties
const Dropdown = ({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className = "",
  inputClassName = "",
  optionInputClassName = "",
}) => {
  if (!options) return null;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-semibold text-gray-800 dark:text-white">
              {label}
            </Listbox.Label>
          )}
          <div className={`relative ${className}`}>
            <Listbox.Button
              className={`flex items-center justify-between bg-white dark:bg-black relative w-full border border-gray-200 dark:border-gray-800 rounded-3xl px-3 py-2 cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-800 dark:focus-visible:ring-indigo-300 sm:text-sm space-x-2 ${inputClassName}`}
            >
              <span className="block truncate dark:text-white flex-1 text-left font-medium">
                {options?.filter((t) => t.value === value)?.[0]?.label}
              </span>
              <span className="inline-flex items-center pointer-events-none bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0 p-0.5 -m-0.5">
                <ChevronDown
                  className="h-5 w-5 text-gray-800 dark:text-gray-600"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="z-10 absolute mt-1 w-full border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-60 rounded-3xl py-1 px-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm min-w-[8rem]"
              >
                {options.map((item) => (
                  <Listbox.Option
                    key={item.value}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                          : "text-gray-900 dark:text-gray-400",
                        `cursor-pointer select-none rounded-3xl py-2 pl-3 pr-1 ${optionInputClassName}`
                      )
                    }
                    value={item.value}
                  >
                    <span className="block truncate font-medium">
                      {item.label}
                    </span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Dropdown;
