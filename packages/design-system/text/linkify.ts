import { ReactNode } from "react";

const regex = /\[(\w.+)\]\((\w.+)\)/;

export const linkify = (
  text: string,
  renderComponent: (text: string, link: string) => ReactNode
) => {
  const result = text.split(" ").map((word) => {
    if (!regex.test(word)) {
      return word + " ";
    }
    const match = [...word.match(regex)!];
    return renderComponent(match[1], match[2]);
  });
  return result;
};
