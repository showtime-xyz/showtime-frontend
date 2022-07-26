// the core implementation comes from https://github.com/jackmoore/autosize/blob/master/src/autosize.js
import {
  useLayoutEffect,
  RefAttributes,
  MutableRefObject,
  ForwardRefExoticComponent,
} from "react";
import { Platform, TextInput } from "react-native";

import type { TextInputProps } from "@showtime-xyz/universal.text-input";

const map = new Map();

const createEvent = (name: string) => new Event(name, { bubbles: true });

const assign = (ta: HTMLElement) => {
  if (!ta || !ta.nodeName || ta.nodeName !== "TEXTAREA" || map.has(ta)) return;
  let heightOffset = 0;
  let clientWidth = 0;
  let cachedHeight = 0;

  const init = () => {
    const style = window.getComputedStyle(ta, null);

    if (style.resize === "vertical") {
      ta.style.resize = "none";
    } else if (style.resize === "both") {
      ta.style.resize = "horizontal";
    }

    if (style.boxSizing === "content-box") {
      heightOffset = -(
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      );
    } else {
      heightOffset =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    }
    // Fix when a textarea is not on document body and heightOffset is Not a Number
    if (isNaN(heightOffset)) {
      heightOffset = 0;
    }

    update();
  };

  const changeOverflow = (value: string) => {
    {
      // Chrome/Safari-specific fix:
      // When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
      // made available by removing the scrollbar. The following forces the necessary text reflow.
      const width = ta.style.width;
      ta.style.width = "0px";
      // Force reflow:
      /* jshint ignore:start */
      ta.offsetWidth;
      /* jshint ignore:end */
      ta.style.width = width;
    }

    ta.style.overflowY = value;
  };

  const getParentOverflows = (el: HTMLElement) => {
    const arr = [];

    while (el && el.parentNode && el.parentNode instanceof Element) {
      if (el.parentNode.scrollTop) {
        arr.push({
          node: el.parentNode,
          scrollTop: el.parentNode.scrollTop,
        });
      }
      el = el.parentNode as any;
    }

    return arr;
  };

  const resize = () => {
    if (ta.scrollHeight === 0) {
      // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
      return;
    }

    const overflows = getParentOverflows(ta);
    const docTop =
      document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

    ta.style.height = "";
    ta.style.height = ta.scrollHeight + heightOffset + "px";

    // used to check if an update is actually necessary on window.resize
    clientWidth = ta.clientWidth;

    // prevents scroll-position jumping
    overflows.forEach((el) => {
      el.node.scrollTop = el.scrollTop;
    });

    if (docTop) {
      document.documentElement.scrollTop = docTop;
    }
  };

  const update = () => {
    resize();

    const styleHeight = Math.round(parseFloat(ta.style.height));
    const computed = window.getComputedStyle(ta, null);

    // Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
    var actualHeight =
      computed.boxSizing === "content-box"
        ? Math.round(parseFloat(computed.height))
        : ta.offsetHeight;

    // The actual height not matching the style height (set via the resize method) indicates that
    // the max-height has been exceeded, in which case the overflow should be allowed.
    if (actualHeight < styleHeight) {
      if (computed.overflowY === "hidden") {
        changeOverflow("scroll");
        resize();
        actualHeight =
          computed.boxSizing === "content-box"
            ? Math.round(parseFloat(window.getComputedStyle(ta, null).height))
            : ta.offsetHeight;
      }
    } else {
      // Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
      if (computed.overflowY !== "hidden") {
        changeOverflow("hidden");
        resize();
        actualHeight =
          computed.boxSizing === "content-box"
            ? Math.round(parseFloat(window.getComputedStyle(ta, null).height))
            : ta.offsetHeight;
      }
    }

    if (cachedHeight !== actualHeight) {
      cachedHeight = actualHeight;
      const evt = createEvent("autosize:resized");
      try {
        ta.dispatchEvent(evt);
      } catch (err) {
        // Firefox will throw an error on dispatchEvent for a detached element
        // https://bugzilla.mozilla.org/show_bug.cgi?id=889376
      }
    }
  };

  const pageResize = () => {
    if (ta.clientWidth !== clientWidth) {
      update();
    }
  };

  const destroy = ((style: any) => {
    window.removeEventListener("resize", pageResize, false);
    ta.removeEventListener("input", update, false);
    ta.removeEventListener("keyup", update, false);
    ta.removeEventListener("autosize:destroy", destroy, false);
    ta.removeEventListener("autosize:update", update, false);

    Object.keys(style).forEach((key: any) => {
      ta.style[key] = style[key];
    });

    map.delete(ta);
  }).bind(ta, {
    height: ta.style.height,
    resize: ta.style.resize,
    overflowY: ta.style.overflowY,
    overflowX: ta.style.overflowX,
    wordWrap: ta.style.wordWrap,
  });

  ta.addEventListener("autosize:destroy", destroy, false);

  window.addEventListener("resize", pageResize, false);
  ta.addEventListener("input", update, false);
  ta.addEventListener("autosize:update", update, false);
  ta.style.overflowX = "hidden";

  map.set(ta, {
    destroy,
    update,
  });

  init();
};

const destroy = (ta: HTMLElement) => {
  const methods = map.get(ta);
  if (methods) {
    methods.destroy();
  }
};

const update = (ta: HTMLElement) => {
  const methods = map.get(ta);
  if (methods) {
    methods.update();
  }
};

const autosize = (el: any) => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], (x) => assign(x));
  }
  return el;
};
autosize.destroy = (el: any) => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], destroy);
  }
  return el;
};
autosize.update = (el: any) => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], update);
  }
  return el;
};

export const useAutoSizeInput = (
  el: MutableRefObject<
    | ForwardRefExoticComponent<
        TextInputProps & RefAttributes<typeof TextInput>
      >
    | HTMLElement
    | undefined
  >
) => {
  useLayoutEffect(() => {
    Platform.OS === "web" && autosize(el.current);
  }, [el]);
};
