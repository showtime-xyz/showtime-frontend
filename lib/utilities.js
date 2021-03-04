export const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, " ");
};

export const truncateWithEllipses = (text, max) => {
  return text.substr(0, max - 1) + (text.length > max ? "..." : "");
};
