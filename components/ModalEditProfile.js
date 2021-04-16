import { useContext, useState, useEffect, Fragment } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Select from "react-dropdown-select";
import { SORT_FIELDS } from "../lib/constants";
import ScrollableModal from "./ScrollableModal";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const handleUsernameLookup = async (value, context, setCustomURLError) => {
  const username = value ? value.trim() : null;
  let validUsername;
  try {
    if (
      username === null ||
      username.toLowerCase() === context.myProfile?.username?.toLowerCase()
    ) {
      validUsername = true;
    } else {
      const result = await backend.get(
        `/v1/username_available?username=${username}`,
        {
          method: "get",
        }
      );
      validUsername = result?.data?.data;
    }
  } catch {
    validUsername = false;
  }
  setCustomURLError(
    validUsername
      ? {
          isError: false,
          message: username === null ? "" : "Username is available",
        }
      : { isError: true, message: "Username is not available" }
  );
  return validUsername;
};
const handleDebouncedUsernameLookup = AwesomeDebouncePromise(
  handleUsernameLookup,
  400
);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Modal({ isOpen, setEditModalOpen }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const SHOWTIME_PROD_URL = "tryshowtime.com/";
  const context = useContext(AppContext);
  const [nameValue, setNameValue] = useState(null);
  const [customURLValue, setCustomURLValue] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linktree, setLinktree] = useState("");
  const [foundation, setFoundation] = useState("");
  const [rarible, setRarible] = useState("");
  const [opensea, setOpensea] = useState("");

  const [customURLError, setCustomURLError] = useState({
    isError: false,
    message: "",
  });
  const [bioValue, setBioValue] = useState(null);
  const [websiteValue, setWebsiteValue] = useState(null);
  const [defaultListId, setDefaultListId] = useState("");
  const [defaultCreatedSortId, setDefaultCreatedSortId] = useState(1);
  const [defaultOwnedSortId, setDefaultOwnedSortId] = useState(1);

  useEffect(() => {
    if (context.myProfile) {
      setNameValue(context.myProfile.name);
      setBioValue(context.myProfile.bio);
      setWebsiteValue(context.myProfile.website_url);
      setDefaultListId(context.myProfile.default_list_id || "");
      setDefaultCreatedSortId(context.myProfile.default_created_sort_id || 1);
      setDefaultOwnedSortId(context.myProfile.default_owned_sort_id || 1);
      setTwitter(context.myProfile.twitter || "");
      setLinktree(context.myProfile.linktree || "");
      setFoundation(context.myProfile.foundation || "");
      setRarible(context.myProfile.rarible || "");
      setOpensea(context.myProfile.opensea || "");
    }
  }, [context.myProfile, isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    mixpanel.track("Save profile edit");

    const username = customURLValue ? customURLValue.trim() : null;

    if (username?.toLowerCase() != context.myProfile.username?.toLowerCase()) {
      const validUsername = await handleUsernameLookup(
        customURLValue,
        context,
        setCustomURLError
      );
      if (!validUsername) {
        return;
      }
    }

    // Post changes to the API
    await fetch(`/api/editprofile`, {
      method: "post",
      body: JSON.stringify({
        name: nameValue ? (nameValue.trim() ? nameValue.trim() : null) : null,
        bio: bioValue ? (bioValue.trim() ? bioValue.trim() : null) : null,
        username,
        website_url: websiteValue
          ? websiteValue.trim()
            ? websiteValue.trim()
            : null
          : null,
        twitter: twitter ? (twitter.trim() ? twitter.trim() : null) : null,
        linktree: linktree ? (linktree.trim() ? linktree.trim() : null) : null,
        foundation: foundation
          ? foundation.trim()
            ? foundation.trim()
            : null
          : null,
        rarible: rarible ? (rarible.trim() ? rarible.trim() : null) : null,
        opensea: opensea ? (opensea.trim() ? opensea.trim() : null) : null,
        default_list_id: defaultListId ? defaultListId : "",
        default_created_sort_id: defaultCreatedSortId,
        default_owned_sort_id: defaultOwnedSortId,
      }),
    });

    // Update state to immediately show changes
    context.setMyProfile({
      ...context.myProfile,
      name: nameValue ? (nameValue.trim() ? nameValue.trim() : null) : null, // handle names with all whitespaces
      bio: bioValue ? (bioValue.trim() ? bioValue.trim() : null) : null,
      username,
      website_url: websiteValue
        ? websiteValue.trim()
          ? websiteValue.trim()
          : null
        : null,
      twitter: twitter ? (twitter.trim() ? twitter.trim() : null) : null,
      linktree: linktree ? (linktree.trim() ? linktree.trim() : null) : null,
      foundation: foundation
        ? foundation.trim()
          ? foundation.trim()
          : null
        : null,
      rarible: rarible ? (rarible.trim() ? rarible.trim() : null) : null,
      opensea: opensea ? (opensea.trim() ? opensea.trim() : null) : null,
      default_list_id: defaultListId ? defaultListId : "",
      default_created_sort_id: defaultCreatedSortId,
      default_owned_sort_id: defaultOwnedSortId,
    });
    setSubmitting(false);
    setEditModalOpen(false);
    const wallet_addresses = context.myProfile?.wallet_addresses;

    router.push(
      `/${username || (wallet_addresses && wallet_addresses[0]) || ""}`
    );
  };

  const tab_list = [
    {
      name: "Select...",
      value: "",
    },
    {
      name: "Created",
      value: 1,
    },
    {
      name: "Owned",
      value: 2,
    },
    {
      name: "Liked",
      value: 3,
    },
  ];

  const sortingOptionsList = [
    //{ label: "Select...", key: "" },
    ...Object.keys(SORT_FIELDS).map((key) => SORT_FIELDS[key]),
  ];

  return (
    <>
      {isOpen && (
        <ScrollableModal
          closeModal={() => setEditModalOpen(false)}
          contentWidth="40rem"
        >
          <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
            <div className="text-3xl border-b-2 pb-2 flex justify-between items-start">
              <div>Edit Info</div>
              <FontAwesomeIcon
                style={{
                  height: 24,
                  width: 24,
                  color: "#ccc",
                }}
                icon={faTimes}
                className="m-1 cursor-pointer"
                onClick={() => setEditModalOpen(false)}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 my-4">
                <div className="text-xl text-indigo-500">Profile</div>

                <div className="py-2">
                  <label htmlFor="name" className="block text-sm text-gray-700">
                    Name
                  </label>
                  <input
                    name="customURL"
                    placeholder="Your custom URL"
                    value={customURLValue ? customURLValue : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setCustomURLValue(value);
                        handleDebouncedUsernameLookup(
                          value,
                          context,
                          setCustomURLError
                        );
                      }
                    }}
                    type="text"
                    maxLength="50"
                    className="mt-1 bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="customURL"
                    className="mt-4 block text-sm font-medium text-gray-700 sm:pt-2"
                  >
                    Username
                  </label>
                  <div className="mt-1 ">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">
                        {SHOWTIME_PROD_URL}
                      </span>
                      <input
                        type="text"
                        name="customURL"
                        id="customURL"
                        autoComplete="username"
                        className="pl-2 border flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                        value={customURLValue ? customURLValue : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const urlRegex = /^[a-zA-Z0-9_]*$/;
                          if (urlRegex.test(value)) {
                            setCustomURLValue(value);
                            handleDebouncedUsernameLookup(
                              value,
                              context,
                              setCustomURLError
                            );
                          }
                        }}
                        autoComplete="false"
                        maxLength={30}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      color: customURLError.isError ? "red" : "#35bb5b",

                      visibility: customURLError.message ? "visible" : "hidden",
                    }}
                    className="text-right text-xs mt-1 mb-1"
                  >
                    {SHOWTIME_PROD_URL}
                  </div>
                  <label htmlFor="bio" className="block text-sm text-gray-700">
                    About Me (optional)
                  </label>
                  <textarea
                    name="bio"
                    placeholder=""
                    value={bioValue ? bioValue : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setTwitter(value);
                      }
                    }}
                    type="text"
                    maxLength="300"
                    rows={3}
                    className="mt-1 bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>

                  <div className="text-right text-gray-500 text-xs">
                    300 character limit
                  </div>
                </div>
                <label htmlFor="linktree" className="text-gray-500  text-sm">
                  Linktree{" "}
                  {/*<span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>*/}
                </label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 7,
                  }}
                  className="mt-1 border-2 border-gray-400 mb-6"
                >
                  <input
                    name="linktree"
                    placeholder="username"
                    value={linktree ? linktree : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setLinktree(value);
                      }
                    }}
                    type="text"
                    maxLength={30}
                    className="w-full"
                    style={{
                      color: "black",
                      borderRadius: 7,
                      padding: 10,
                      paddingLeft: 78,
                      fontSize: 16,
                    }}
                    autoComplete="false"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      paddingLeft: 10,
                      paddingTop: 13,
                      paddingBottom: 12,
                      paddingRight: 7,
                      borderBottomLeftRadius: 7,
                      borderTopLeftRadius: 7,
                      backgroundColor: "#eee",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    linktr.ee/
                  </div>
                </div>
                <label htmlFor="foundation" className="text-gray-500  text-sm">
                  Foundation{" "}
                  {/*<span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>*/}
                </label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 7,
                  }}
                  className="mt-1 border-2 border-gray-400 mb-6"
                >
                  <input
                    name="foundation"
                    placeholder="username"
                    value={foundation ? foundation : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setFoundation(value);
                      }
                    }}
                    type="text"
                    maxLength={30}
                    className="w-full"
                    style={{
                      color: "black",
                      borderRadius: 7,
                      padding: 10,
                      paddingLeft: 125,
                      fontSize: 16,
                    }}
                    autoComplete="false"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      paddingLeft: 10,
                      paddingTop: 13,
                      paddingBottom: 12,
                      paddingRight: 7,
                      borderBottomLeftRadius: 7,
                      borderTopLeftRadius: 7,
                      backgroundColor: "#eee",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    foundation.app/
                  </div>
                </div>
                <label htmlFor="rarible" className="text-gray-500  text-sm">
                  Rarible{" "}
                  {/*<span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>*/}
                </label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 7,
                  }}
                  className="mt-1 border-2 border-gray-400 mb-6"
                >
                  <input
                    name="rarible"
                    placeholder="username"
                    value={rarible ? rarible : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setRarible(value);
                      }
                    }}
                    type="text"
                    maxLength={30}
                    className="w-full"
                    style={{
                      color: "black",
                      borderRadius: 7,
                      padding: 10,
                      paddingLeft: 99,
                      fontSize: 16,
                    }}
                    autoComplete="false"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      paddingLeft: 10,
                      paddingTop: 13,
                      paddingBottom: 12,
                      paddingRight: 7,
                      borderBottomLeftRadius: 7,
                      borderTopLeftRadius: 7,
                      backgroundColor: "#eee",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    rarible.com/
                  </div>
                </div>
                <label htmlFor="opensea" className="text-gray-500  text-sm">
                  Opensea{" "}
                  {/*<span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>*/}
                </label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 7,
                  }}
                  className="mt-1 border-2 border-gray-400 mb-6"
                >
                  <input
                    name="opensea"
                    placeholder="username"
                    value={opensea ? opensea : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const urlRegex = /^[a-zA-Z0-9_]*$/;
                      if (urlRegex.test(value)) {
                        setOpensea(value);
                      }
                    }}
                    type="text"
                    maxLength={30}
                    className="w-full"
                    style={{
                      color: "black",
                      borderRadius: 7,
                      padding: 10,
                      paddingLeft: 98,
                      fontSize: 16,
                    }}
                    autoComplete="false"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      paddingLeft: 10,
                      paddingTop: 13,
                      paddingBottom: 12,
                      paddingRight: 7,
                      borderBottomLeftRadius: 7,
                      borderTopLeftRadius: 7,
                      backgroundColor: "#eee",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    opensea.io/
                  </div>
                </div>
                <label
                  htmlFor="website_url"
                  className="block text-sm text-gray-700 mt-1"
                >
                  Website URL
                </label>
                <input
                  name="opensea"
                  placeholder="username"
                  value={opensea ? opensea : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const urlRegex = /^[a-zA-Z0-9_]*$/;
                    if (urlRegex.test(value)) {
                      setOpensea(value);
                    }
                  }}
                  type="text"
                  className="mt-1 bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-4 flex-shrink" />
              <div className="my-4 flex-1">
                <div className="text-xl text-indigo-500">Page Settings</div>
                <div className="py-2 mb-2">
                  <Listbox
                    value={defaultListId}
                    onChange={(value) => {
                      setDefaultListId(value);
                    }}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm text-gray-700">
                          Default NFT List
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <span className="block truncate">
                              {
                                tab_list.filter(
                                  (t) => t.value === defaultListId
                                )[0].name
                              }
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              static
                              className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                              {tab_list.map((item) => (
                                <Listbox.Option
                                  key={item.value}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-indigo-600"
                                        : "text-gray-900",
                                      "cursor-default select-none relative py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={item.value}
                                >
                                  {({ active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          item.value === defaultListId
                                            ? "font-normal" // "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        {item.name}
                                      </span>

                                      {item.value === defaultListId ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-indigo-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                <div className="py-2 mb-2">
                  <Listbox
                    value={defaultCreatedSortId}
                    onChange={(value) => {
                      setDefaultCreatedSortId(value);
                    }}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm text-gray-700">
                          Sort Created By
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <span className="block truncate">
                              {
                                sortingOptionsList.filter(
                                  (t) => t.value === defaultCreatedSortId
                                )[0].label
                              }
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              static
                              className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                              {sortingOptionsList.map((item) => (
                                <Listbox.Option
                                  key={item.value}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-indigo-600"
                                        : "text-gray-900",
                                      "cursor-default select-none relative py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={item.value}
                                >
                                  {({ active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          item.value === defaultCreatedSortId
                                            ? "font-normal" // "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        {item.label}
                                      </span>

                                      {item.value === defaultCreatedSortId ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-indigo-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                <div className="py-2  mb-2 mb-12">
                  <Listbox
                    value={defaultOwnedSortId}
                    onChange={(value) => {
                      setDefaultOwnedSortId(value);
                    }}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm text-gray-700">
                          Sort Owned By
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <span className="block truncate">
                              {
                                sortingOptionsList.filter(
                                  (t) => t.value === defaultOwnedSortId
                                )[0].label
                              }
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              static
                              className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                              {sortingOptionsList.map((item) => (
                                <Listbox.Option
                                  key={item.value}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-indigo-600"
                                        : "text-gray-900",
                                      "cursor-default select-none relative py-2 pl-3 pr-9 "
                                    )
                                  }
                                  value={item.value}
                                >
                                  {({ active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          item.value === defaultOwnedSortId
                                            ? "font-normal" // "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        {item.label}
                                      </span>

                                      {item.value === defaultOwnedSortId ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-indigo-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                  <div className="py-4"></div>
                </div>
              </div>
            </div>

            {/* Submit section */}
            <div>
              <div className="border-t-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="showtime-green-button px-4 py-2 float-right rounded-full w-36"
                  style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-card-spinner-small" />
                    </div>
                  ) : (
                    "Save changes"
                  )}
                </button>
                <button
                  type="button"
                  className="showtime-black-button-outline px-4 py-2  rounded-full"
                  onClick={() => {
                    setEditModalOpen(false);
                    setNameValue(context.myProfile.name);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </ScrollableModal>
      )}
    </>
  );
}
