import { classNames } from "@/lib/utilities";
import { Switch as HeadlessSwitch } from "@headlessui/react";

const Switch = ({ value, onChange, disabled = false }) => {
  return (
    <HeadlessSwitch
      checked={value}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        value
          ? "bg-gradient-to-r from-indigo-500 dark:from-cyan-400 to-[#6366F1] dark:to-[#22D3EE]"
          : "bg-gray-200 dark:bg-gray-700",
        "relative inline-flex flex-shrink-0 h-6 w-11 p-[2px] rounded-full cursor-pointer transition ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          value ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-black shadow transform ring-0 transition ease-in-out duration-200"
        )}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
