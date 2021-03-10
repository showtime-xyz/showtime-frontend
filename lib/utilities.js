export const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, " ");
};

export const truncateWithEllipses = (text, max) => {
  if (!text) return null;
  return text.substr(0, max - 1) + (text.length > max ? "..." : "");
};

export const getImageUrl = (img_url) => {
  var url = img_url
    ? img_url
    : null;
  if (url === null) {
    return "https://storage.googleapis.com/opensea-static/opensea-profile/4.png";
  }
  if (url.includes("https://lh3.googleusercontent.com")) {
    url = url.split("=")[0] + "=s375";
  }
  return url;
};
