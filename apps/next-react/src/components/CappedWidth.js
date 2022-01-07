const CappedWidth = ({ children }) => {
  return (
    <div className="max-w-screen-2xl sm:px-3 mx-auto w-full">{children}</div>
  );
};

export default CappedWidth;
