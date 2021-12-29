/**
 * Prevents "e" from being a valid price input. Inputs of the type number
 * support "e" as an input causing the onChange to not be emitted and causing unexpected behaviors.
 */
export const preventExponent = (event) => {
  if (event.key === "e") {
    event.preventDefault();
  }
};
