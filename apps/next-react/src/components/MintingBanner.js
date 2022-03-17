import { useContext } from "react";

import AppContext from "@/context/app-context";
import useStickyState from "@/hooks/useStickyState";
import { Transition } from "@headlessui/react";

import XIcon from "./Icons/XIcon";

const MintingBanner = ({ openMintModal }) => {
  const { user, setLoginModalOpen } = useContext(AppContext);
  const [show, setShow] = useStickyState("showMintBanner", true, false);

  return (
    <Transition
      as="span"
      show={show}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="relative bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-sm">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              <button
                onClick={user ? openMintModal : () => setLoginModalOpen(true)}
                className="md:hidden text-gray-900 dark:text-gray-100 font-bold text-left"
              >
                You can now create, buy and sell NFTs for free!{" "}
                <span aria-hidden="true">&rarr;</span>
              </button>
              <span className="hidden md:inline">
                <span className="text-xs mr-1 -mt-1 inline-block">🎉</span> You
                can now create, buy and sell NFTs for free (no gas costs)!{" "}
                <button
                  className="text-gray-900 dark:text-gray-100 font-bold"
                  onClick={user ? openMintModal : () => setLoginModalOpen(true)}
                >
                  Get started
                </button>
                .
              </span>
            </p>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              onClick={() => setShow(false)}
              type="button"
              className="flex p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon
                className="h-6 w-6 text-gray-900 dark:text-gray-100"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default MintingBanner;
