import Layout from "@/components/layout";
import AppContext from "@/context/app-context";
import { classNames, formatAddressShort } from "@/lib/utilities";
import { Fragment, useContext, useEffect, useState } from "react";
import { DAppClient, PermissionScope, SigningType } from "@airgap/beacon-sdk";
import ModalAddWallet from "@/components/ModalAddWallet";
import axios from "@/lib/axios";
import backend from "@/lib/backend";
import { Menu, Transition } from "@headlessui/react";
import { useTheme } from "next-themes";

const Wallet = () => {
  const {
    myProfile,
    user,
    setLoginModalOpen,
    setMyProfile,
    setMyLikes,
    setMyFollows,
    isMobile,
  } = useContext(AppContext);
  const { resolvedTheme } = useTheme();
  const [dAppClient, setDAppClient] = useState(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    setDAppClient(
      new DAppClient({ name: "Showtime", colorMode: resolvedTheme })
    );
  }, [resolvedTheme]);

  const loginWithTezos = async () => {
    const { address: tezosAddr, publicKey: tezosPk } =
      await dAppClient.requestPermissions({
        scopes: [PermissionScope.SIGN],
      });

    const {
      data: { data: nonce },
    } = await backend.get(`/v1/getnonce?address=${tezosAddr}`);

    const payload = Buffer.from(
      `${process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_TEZOS_WALLET} ${nonce}`,
      "utf8"
    ).toString("hex");
    const signature = await dAppClient
      .requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: payload,
      })
      .then((res) => res.signature);

    await axios.put("/api/auth/wallet/tz", {
      address: tezosAddr,
      signature,
      publicKey: tezosPk,
    });

    setWalletAddresses((walletAddresses) => [
      ...walletAddresses,
      { address: tezosAddr, ens_domain: null },
    ]);

    // UPDATE THE PROFILE STATE DATA
    try {
      const my_info_data = await axios
        .get("/api/profile")
        .then((res) => res.data);
      setMyLikes(my_info_data.data.likes_nft);
      setMyFollows(my_info_data.data.follows);
      setMyProfile(my_info_data.data.profile);
    } catch (error) {
      console.error(error);
    }

    dAppClient.clearActiveAccount();
  };

  //TODO: Revalidate state instead of this when we switch away from context
  const [walletAddresses, setWalletAddresses] = useState(null);

  useEffect(() => {
    setWalletAddresses(myProfile?.wallet_addresses_excluding_email_v2);
  }, [myProfile?.wallet_addresses_excluding_email_v2]);

  const unlinkAddress = async (address) => {
    if (address.toLowerCase() === user?.publicAddress) return;

    await axios.delete("/api/auth/wallet", { data: { address } });

    setWalletAddresses((walletAddresses) =>
      walletAddresses.filter(({ address: stateAddr }) => stateAddr !== address)
    );

    // UPDATE THE PROFILE STATE DATA
    try {
      const my_info_data = await axios
        .get("/api/profile")
        .then((res) => res.data);
      //setMyLikes(my_info_data.data.likes_nft) // These only will change when adding wallets
      //setMyFollows(my_info_data.data.follows) // These only will change when adding wallets
      setMyProfile(my_info_data.data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {typeof document !== "undefined" ? (
        <ModalAddWallet
          isOpen={walletModalOpen}
          setWalletModalOpen={setWalletModalOpen}
          walletAddresses={myProfile?.wallet_addresses_v2}
        />
      ) : null}
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          {myProfile ? (
            <div className="w-full flex flex-col max-w-2xl mx-auto  shadow sm:rounded-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800 sm:px-6">
                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                      Wallets
                    </h3>
                  </div>
                  <div className="ml-4 mt-2 flex-shrink-0">
                    <Menu as="div" className="relative inline-block text-left">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-100 bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-indigo-900 transition">
                              Add Wallet
                            </Menu.Button>
                          </div>

                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => setWalletModalOpen(true)}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-500",
                                        "block w-full text-left px-4 py-2 text-sm transition"
                                      )}
                                    >
                                      Add Ethereum wallet
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={loginWithTezos}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-500",
                                        "block w-full text-left px-4 py-2 text-sm transition"
                                      )}
                                    >
                                      Add Tezos wallet
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-x-auto w-full">
                  <div className="align-middle inline-block min-w-full">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody>
                          {walletAddresses?.map(
                            ({ address, ens_domain }, i) => (
                              <tr
                                key={address}
                                className={
                                  i % 2 === 0
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-50 dark:bg-gray-900"
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-400">
                                  {ens_domain
                                    ? ens_domain
                                    : isMobile
                                    ? formatAddressShort(address)
                                    : address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {address.startsWith("tz")
                                    ? "Tezos"
                                    : "Ethereum"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {address.toLowerCase() ===
                                  user?.publicAddress.toLowerCase() ? (
                                    <span className="text-gray-600 dark:text-gray-500">
                                      Signed In
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => unlinkAddress(address)}
                                      className="text-red-600 hover:text-red-900 dark:hover:text-red-700 transition"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-transparent dark:border-gray-800 dark:bg-gray-900 shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-300">
                  Sign in to manage your wallets
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Once you're signed in, you'll be able to add and remove your
                    Ethereum and Tezos wallets.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-stpink bg-stpink bg-opacity-20 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stpink sm:text-sm transition"
                  >
                    Sign in to Showtime
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Wallet;
