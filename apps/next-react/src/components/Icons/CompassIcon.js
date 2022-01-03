export const CompassIconOutline = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    <path d="M17.189 8.076a1 1 0 00-1.265-1.265l-6.36 2.12a1 1 0 00-.633.633l-2.12 6.36a1 1 0 001.265 1.265l6.36-2.12a1 1 0 00.633-.633l2.12-6.36zM9.34 14.66l1.33-3.988 3.988-1.33-1.33 3.988-3.988 1.33z" />
    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

export const CompassIconSolid = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.341 14.659l1.33-3.988 3.988-1.33-1.33 3.988-3.988 1.33z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.189-3.924a1 1 0 00-1.265-1.265l-6.36 2.12a1 1 0 00-.633.633l-2.12 6.36a1 1 0 001.265 1.265l6.36-2.12a1 1 0 00.633-.633l2.12-6.36z"
    />
  </svg>
);

const CompassIcon = CompassIconOutline;

export default CompassIcon;
