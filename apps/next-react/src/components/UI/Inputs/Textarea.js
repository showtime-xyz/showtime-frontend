const Input = ({
  label,
  labelSubtitle,
  id,
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      <label
        className={`block dark:text-gray-300 mb-1 text-sm font-bold ${
          labelSubtitle && "flex items-center"
        }`}
        htmlFor={id}
      >
        {label}
        {labelSubtitle}
      </label>
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 px-4 py-3 rounded-2xl w-full font-medium focus:outline-none resize-none"
        id={id}
        {...props}
      />
    </div>
  );
};

export default Input;
