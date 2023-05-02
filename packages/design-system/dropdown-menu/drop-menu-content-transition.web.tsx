import React, { Fragment } from "react";

import { Transition } from "@headlessui/react";

export const ContentTransition: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  return (
    <Transition
      as={Fragment}
      show
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {children}
    </Transition>
  );
};
