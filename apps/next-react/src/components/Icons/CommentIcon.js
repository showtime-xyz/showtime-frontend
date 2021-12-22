const CommentIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9931 18.9999L12 18.9999C16.6211 18.9999 20 15.6726 20 12C20 8.32734 16.6211 5 12 5C7.37888 5 4 8.32734 4 12C4 13.3314 4.42539 14.5848 5.18504 15.6632C5.56429 16.2015 5.65421 16.8921 5.4255 17.5096L5.12275 18.327L6.87528 17.9721C7.3017 17.8858 7.74464 17.9408 8.13694 18.1289C9.34314 18.7073 10.6606 19.0045 11.9931 18.9999ZM12 20.9999C10.3652 21.0056 8.74977 20.6408 7.27222 19.9323L3.75985 20.6436C2.99184 20.7991 2.35147 20.051 2.62363 19.3161L3.55 16.815C2.56889 15.4222 2 13.7707 2 12C2 7.02974 6.47778 3 12 3C17.5222 3 22 7.02974 22 12C22 16.9702 17.5222 20.9999 12 20.9999Z"
    />
  </svg>
);

export const CommentIconSolid = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 21c-1.635.006-3.25-.36-4.728-1.068l-3.512.712a1 1 0 01-1.136-1.328l.926-2.501C2.569 15.422 2 13.771 2 12c0-4.97 4.478-9 10-9s10 4.03 10 9-4.478 9-10 9z"
    />
  </svg>
);

export default CommentIcon;
