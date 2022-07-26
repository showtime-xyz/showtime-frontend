import { useEffect } from "react";

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any)["mozCancelFullScreen"]) {
    (document as any)["mozCancelFullScreen"]();
  } else if ((document as any)["webkitExitFullscreen"]) {
    (document as any)["webkitExitFullscreen"]();
  } else if ((document as any)["msExitFullscreen"]) {
    (document as any)["msExitFullscreen"]();
  }
};

export const useFullScreen = (
  elementOrElementId: HTMLElement | string,
  showFullScreen: boolean
) => {
  useEffect(() => {
    let fullScreenElement =
      document["fullscreenElement"] ||
      (document as any)["webkitFullscreenElement"] ||
      (document as any)["mozFullScreenElement"] ||
      (document as any)["msFullscreenElement"];

    // exit full screen
    if (!showFullScreen) {
      if (fullScreenElement) {
        exitFullScreen();
      }
      return;
    }

    // get the element to make full screen
    const element =
      typeof elementOrElementId === "string"
        ? document.getElementById(elementOrElementId)
        : elementOrElementId;

    // if there's another element currently full screen, exit first
    if (fullScreenElement && fullScreenElement !== element) {
      exitFullScreen();
      fullScreenElement = null;
    }

    // if the current element is not already full screen, make it full screen
    if (!fullScreenElement) {
      if (element?.requestFullscreen) {
        element.requestFullscreen();
      } else if ((document as any)["mozRequestFullScreen"]) {
        (document as any)["mozRequestFullScreen"]();
      } else if ((document as any)["webkitRequestFullscreen"]) {
        // @ts-ignore
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if ((document as any)["msRequestFullscreen"]) {
        (document as any)["msRequestFullscreen"]();
      }
    }

    // if full screen, the exit on unmount
    if (showFullScreen) {
      return exitFullScreen;
    }
  }, [showFullScreen, elementOrElementId]);
};
