import type { ReactNode } from "react";

const int = (v: string) => parseFloat(v);
const countRows = (h: number, l: number) => Math.round(h / l);
const binarySearch = (text: string | any[], cb: (arg0: number) => any) => {
  let min = 0,
    max = text.length - 1;

  while (min <= max) {
    const mid = Math.ceil((max + min) / 2);
    const result = cb(mid);
    max = result > 0 ? mid - 1 : max;
    min = result < 0 ? mid + 1 : min;

    if (result === 0) return mid;
  }
};

type MultiClampParams = {
  rows: number;
  expandable?: boolean;
  foldable?: boolean;
  foldableDom?: HTMLSpanElement;
  expandableDom?: HTMLSpanElement;
  ellipsis?: string;
  foldText?: string;
  expandText?: string;
  expendTagClassName?: string;
  foldTagClassName?: string;
  originText: string | Iterable<ReactNode> | null;
};
export class MultiClamp {
  ele: Element;
  text: string;
  singleLineHeight: number;
  rows: number = 2;
  expandable: boolean = false;
  foldable: boolean = false;
  foldableDom?: Node;
  expandableDom?: Node;
  foldText: string = "Less";
  expandText: string = "More";
  ellipsis: string = "...";
  expendTagClassName?: string = "";
  foldTagClassName?: string = "";
  originText?: string = "";
  originNode: Node;
  constructor(element: HTMLElement, config: MultiClampParams) {
    Object.assign(this, config);
    this.originNode = element.cloneNode(true);
    this.ele = element;
    this.text = element.innerText;

    this.singleLineHeight = this.getEleLineHeight();

    // determine if text needs to be omitted
    const initRows = countRows(this.getContentHeight(), this.singleLineHeight);
    if (initRows <= this.rows) return;

    // create expand/fold dom
    if (this.expandable) this.expandableDom = this.createExpandableDom();
    if (this.foldable) this.foldableDom = this.createFoldableDom();

    this.clamp();
  }
  // create expand tag
  createExpandableDom = () => {
    const expendDom = document.createElement("span");
    expendDom.innerHTML = this.expandText;
    const classNames = ["expand", this.expendTagClassName];
    expendDom.className = classNames.join(" ");
    expendDom.onclick = () => {
      if (typeof this.originText === "string") {
        this.ele.innerHTML = this.text;
        if (this.foldableDom) this.ele.appendChild(this.foldableDom);
      } else {
        this.foldableDom && this.originNode?.appendChild(this.foldableDom);
        this.ele.innerHTML = "";
        this.ele.appendChild(this.originNode);
      }
    };
    return expendDom;
  };
  // create fold tag
  createFoldableDom = () => {
    const foldDom = document.createElement("span");
    foldDom.innerHTML = this.foldText;
    const classNames = ["fold", this.foldTagClassName];
    foldDom.className = classNames.join(" ");
    foldDom.onclick = () => {
      this.clamp();
    };
    return foldDom;
  };
  fillText(text: string, addExp?: boolean) {
    this.ele.innerHTML = text;
    if (addExp) this.ele.appendChild(this.expandableDom as Node);
  }

  textRows = (text: string) => {
    this.fillText(text, this.expandable);
    return countRows(this.getContentHeight(), this.singleLineHeight);
  };

  sliceText = (pos: number) => `${this.text.slice(0, pos)}${this.ellipsis}`;

  getStyle = (attr: keyof CSSStyleDeclaration) =>
    window.getComputedStyle
      ? window.getComputedStyle(this.ele, null)[attr]
      : (this.ele as any).currentStyle[attr];

  getContentHeight() {
    const height = (this.ele as HTMLElement).offsetHeight;
    const attrs = ["borderTop", "borderBottom", "paddingTop", "paddingBottom"];
    return (
      height -
      attrs.reduce(
        (total, cur) =>
          total + int(this.getStyle(cur as keyof CSSStyleDeclaration)),
        0
      )
    );
  }

  getEleLineHeight() {
    let lineHeight = int(this.getStyle("lineHeight"));
    if (isNaN(lineHeight)) {
      this.fillText("test");
      lineHeight = this.getContentHeight();
      this.fillText(this.text);
    }
    return lineHeight;
  }

  clamp() {
    const { text, rows, sliceText, textRows } = this;

    const lastStrPosition = binarySearch(text, (cur) => {
      const curRows = textRows(sliceText(cur));
      if (curRows !== rows) return curRows - rows;
      return textRows(sliceText(cur + 1)) - rows - 1;
    });
    if (lastStrPosition === undefined) return;
    this.fillText(sliceText(lastStrPosition), this.expandable);
  }
}
