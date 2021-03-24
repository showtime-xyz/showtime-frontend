import { useState, useEffect } from "react";

/**
 * Hook for handling closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export default function useDetectOutsideClick(el, initialState, container) {
  const [isActive, setIsActive] = useState(initialState);
  const background = container
    ? container.current
    : typeof window !== "undefined"
    ? window
    : null;

  useEffect(() => {
    const onClick = (e) => {
      // If the active element exists and is clicked outside of
      if (el.current !== null && !el.current.contains(e.target)) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isActive) {
      background.addEventListener("click", onClick);
    }

    return () => {
      background.removeEventListener("click", onClick);
    };
  }, [isActive, el]);

  return [isActive, setIsActive];
}
