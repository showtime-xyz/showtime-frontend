import { Fragment, useState } from "react";

import { formatAddressShort, copyToClipBoard } from "@/lib/utilities";
import { Popover, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import Link from "next/link";

import ChevronDown from "./Icons/ChevronDown";
import CopyIcon from "./Icons/CopyIcon";
import EthereumIcon from "./Icons/EthereumIcon";
import TezosIcon from "./Icons/TezosIcon";

export const AddressCollection = ({ addresses, isMyProfile = false }) => {
  // Make sure Ethereum addresses always show up first
  addresses = addresses.sort(
    ({ address: firstAddr }, { address: secondAddr }) => {
      if (!firstAddr.startsWith("tz") && secondAddr.startsWith("tz")) return -1;
      if (firstAddr.startsWith("tz") && !secondAddr.startsWith("tz")) return 1;

      return 0;
    }
  );

  const firstAddress = addresses[0];

  if (!firstAddress) return null;

  return (
    <Popover className="relative">
      <div className="flex md:ml-1 space-x-2">
        <AddressButton {...firstAddress} />
        {(addresses.length > 1 || isMyProfile) && (
          <>
            <Popover.Button
              className={({ open }) =>
                `border rounded-full px-3 py-1 text-sm flex items-center space-x-2 text-gray-800 dark:text-white font-medium transition whitespace-nowrap ${
                  open
                    ? "bg-gray-100 dark:bg-gray-800 border-transparent"
                    : "dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent"
                }`
              }
            >
              {addresses.length > 1 && (
                <span className="font-medium">
                  +{addresses.length - 1} more
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition transform duration-100 ease-out"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition transform duration-75 ease-out"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-20 top-10 right-0 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 shadow rounded-xl">
                <div className="space-y-3">
                  {addresses
                    .filter((a, i) => i !== 0)
                    .map(({ address, ens_domain }) => (
                      <div
                        key={address}
                        className="flex items-center space-x-4"
                      >
                        {address.startsWith("tz") ? (
                          <TezosIcon className="h-6 w-auto text-gray-500 dark:text-gray-600" />
                        ) : (
                          <EthereumIcon className="h-6 w-auto text-gray-500 dark:text-gray-600" />
                        )}
                        <AddressButton
                          address={address}
                          ens_domain={ens_domain}
                          isCollection={true}
                        />
                      </div>
                    ))}
                </div>
                {isMyProfile && (
                  <>
                    {addresses.length > 1 && (
                      <hr className="my-4 w-full border-gray-200 dark:border-gray-800" />
                    )}
                    <Link href="/wallet">
                      <a className="block text-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-400 px-4 py-3 rounded-2xl w-full font-medium transition whitespace-nowrap">
                        Manage Wallets
                      </a>
                    </Link>
                  </>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </div>
    </Popover>
  );
};

const AddressButton = ({ address, ens_domain, isCollection = false }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyAddress = () => {
    copyToClipBoard(address);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 500);
  };

  return (
    <span
      className={`border dark:border-gray-700 rounded-full px-3 py-1 text-sm flex items-center justify-between space-x-2 text-gray-800 dark:text-white ${
        isCollection ? "flex-1" : ""
      }`}
    >
      <span className="font-medium whitespace-nowrap">
        {formatAddressShort(ens_domain || address)}
      </span>
      <button
        onClick={copyAddress}
        className="p-1 -m-1 rounded-full text-gray-500"
      >
        {hasCopied ? (
          <CheckIcon className="w-4 h-auto" />
        ) : (
          <CopyIcon className="w-4 h-auto" />
        )}
      </button>
    </span>
  );
};

export default AddressButton;
