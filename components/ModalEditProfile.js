import { useContext, useState, useEffect, Fragment } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLink,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
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

  const [socialLinks, setSocialLinks] = useState();
  const [socialLinkOptions, setSocialLinkOptions] = useState([]);

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
      setCustomURLValue(context.myProfile.username);
      setBioValue(context.myProfile.bio);
      setWebsiteValue(context.myProfile.website_url);
      setDefaultListId(context.myProfile.default_list_id || "");
      setDefaultCreatedSortId(context.myProfile.default_created_sort_id || 1);
      setDefaultOwnedSortId(context.myProfile.default_owned_sort_id || 1);
      setSocialLinks(context.myProfile.links);
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
        name: nameValue?.trim() ? nameValue.trim() : null, // handle names with all whitespaces
        bio: bioValue?.trim() ? bioValue.trim() : null,
        username: username?.trim() ? username.trim() : null,
        website_url: websiteValue?.trim() ? websiteValue.trim() : null,
        links: socialLinks
          .filter((sl) => sl.user_input?.trim())
          .map((sl) => ({
            type_id: sl.type_id,
            user_input: sl.user_input?.trim() ? sl.user_input.trim() : null,
          })),
        default_list_id: defaultListId ? defaultListId : "",
        default_created_sort_id: defaultCreatedSortId,
        default_owned_sort_id: defaultOwnedSortId,
      }),
    });

    // Update state to immediately show changes
    context.setMyProfile({
      ...context.myProfile,
      name: nameValue?.trim() ? nameValue.trim() : null, // handle names with all whitespaces
      bio: bioValue?.trim() ? bioValue.trim() : null,
      username: username?.trim() ? username.trim() : null,
      website_url: websiteValue?.trim() ? websiteValue.trim() : null,
      links: socialLinks
        .filter((sl) => sl.user_input?.trim())
        .map((sl) => ({
          ...sl,
          user_input: sl.user_input?.trim(),
        })),
      default_list_id: defaultListId ? defaultListId : "",
      default_created_sort_id: defaultCreatedSortId,
      default_owned_sort_id: defaultOwnedSortId,
    });
    setSubmitting(false);
    setEditModalOpen(false);
    const wallet_addresses = context.myProfile?.wallet_addresses;
    // confirm saved correctly
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

  useEffect(() => {
    const getSocialLinkOptions = async () => {
      const options = await fetch(`/api/getsociallinkoptions`, {});
      const optionsJson = await options.json();
      setSocialLinkOptions(
        optionsJson
          ? optionsJson.map((opt) => ({
              type_id: opt.id,
              icon_url: opt.icon_url,
              name: opt.name,
              prefix: opt.prefix,
            }))
          : []
      );
    };
    getSocialLinkOptions();
  }, []);

  const emptySelectedAddSocialLink = {
    //icon_url: "/icons/twitter.png",
    type_id: -1,
    name: "Select website...",
  };
  const [selectedAddSocialLink, setSelectedAddSocialLink] = useState(
    emptySelectedAddSocialLink
  );

  const handleAddSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { ...selectedAddSocialLink, user_input: "" },
    ]);

    setSelectedAddSocialLink(emptySelectedAddSocialLink);
  };

  const handleRemoveSocialLink = (id) => {
    setSocialLinks(
      socialLinks.filter((socialLink) => socialLink.type_id !== id)
    );
  };

  const filteredSocialLinkOptions = () => {
    return socialLinkOptions.filter(
      (option) => !socialLinks.map((sl) => sl.type_id).includes(option.type_id)
    );
  };

  const handleSocialSelected = (event) => {
    setSocialLinks([...socialLinks, { ...event, user_input: "" }]);
    //setSelectedAddSocialLink();
    //handleAddSocialLink();
  };

  return (
    <>
      {isOpen && (
        <ScrollableModal
          closeModal={() => setEditModalOpen(false)}
          contentWidth="60rem"
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
              <div className="flex-1 my-4  ">
                <div className="text-xl text-indigo-500 mb-3">Profile</div>

                <div className="py-2">
                  <label htmlFor="name" className="block text-sm text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    placeholder="Your display name"
                    value={nameValue ? nameValue : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNameValue(value);
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
                      <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 sm:text-sm">
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
                </div>
                <div
                  style={{
                    color: customURLError.isError ? "red" : "#35bb5b",
                    fontSize: 12,
                    visibility: customURLError.message ? "visible" : "hidden",
                  }}
                  className="text-right"
                >
                  &nbsp;{customURLError.message}
                </div>
                <label htmlFor="bio" className="block text-sm text-gray-700">
                  About Me (optional)
                </label>
                <textarea
                  name="bio"
                  placeholder=""
                  value={bioValue ? bioValue : ""}
                  onChange={(e) => {
                    setBioValue(e.target.value);
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
              <div className="w-6 flex-shrink" />
              {/* second row */}
              <div className="flex-1 my-4 md:pr-4">
                <div>
                  <div className="text-xl text-indigo-500  mb-3">Links</div>

                  <div className="py-2">
                    {socialLinks &&
                      socialLinks.map((linkObj) => (
                        <div key={linkObj.name} className="mb-4 pb-2">
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor={linkObj.name}
                              className="block text-sm font-medium text-gray-700 flex flex-row"
                            >
                              <img
                                className="h-5 w-5 mr-1"
                                src={linkObj.icon_url}
                              />
                              {linkObj.name}
                            </label>
                            <span
                              className="text-xs ml-2 text-gray-400 hover:text-red-400 cursor-pointer"
                              onClick={() =>
                                handleRemoveSocialLink(linkObj.type_id)
                              }
                            >
                              Remove
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="max-w-lg flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 sm:text-sm">
                                {linkObj.prefix}
                              </span>
                              <input
                                type="text"
                                name={linkObj.name}
                                id={linkObj.name}
                                className="pl-2 border flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                value={
                                  linkObj.user_input ? linkObj.user_input : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;

                                  setSocialLinks(
                                    socialLinks.map((link) => {
                                      if (link.name === linkObj.name) {
                                        return { ...link, user_input: value };
                                      }
                                      return link;
                                    })
                                  );
                                }}
                                autoComplete="false"
                                maxLength={50}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Listbox
                          value={selectedAddSocialLink}
                          onChange={handleSocialSelected}
                        >
                          {({ open }) => (
                            <>
                              <Listbox.Label className="block text-sm text-gray-700">
                                Add Link
                              </Listbox.Label>
                              <div className="flex flex-row items-center">
                                <div className="text-lg">
                                  <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    className="mr-2"
                                  />
                                </div>
                                <div className="flex items-center flex-grow">
                                  <div className="mt-1 relative flex-1">
                                    <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                      {/* <span className="block truncate">
                                      {selectedAddSocialLink.name}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                      <SelectorIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span> */}
                                      <span className="flex items-center">
                                        {selectedAddSocialLink.icon_url && (
                                          <img
                                            src={selectedAddSocialLink.icon_url}
                                            alt=""
                                            className="flex-shrink-0 h-6 w-6 rounded-full"
                                          />
                                        )}
                                        <span
                                          className={` ${
                                            selectedAddSocialLink.icon_url
                                              ? "ml-3"
                                              : null
                                          }  block truncate`}
                                        >
                                          {selectedAddSocialLink.name}
                                        </span>
                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                          <SelectorIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                        </span>
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
                                        {filteredSocialLinkOptions().map(
                                          (opt) => (
                                            <Listbox.Option
                                              key={opt.type_id}
                                              className={({ active }) =>
                                                classNames(
                                                  active
                                                    ? "text-white bg-indigo-600"
                                                    : "text-gray-900",
                                                  "cursor-default select-none relative py-2 pl-3 pr-9"
                                                )
                                              }
                                              value={opt}
                                            >
                                              {({ active }) => (
                                                <>
                                                  <div className="flex items-center">
                                                    <img
                                                      src={opt.icon_url}
                                                      alt=""
                                                      className="flex-shrink-0 h-6 w-6 rounded-full"
                                                    />
                                                    <span
                                                      className={classNames(
                                                        opt.type_id ===
                                                          selectedAddSocialLink.type_id
                                                          ? "font-normal" // "font-semibold"
                                                          : "font-normal",
                                                        "ml-3 block truncate"
                                                      )}
                                                    >
                                                      {opt.name}
                                                    </span>
                                                  </div>

                                                  {opt ===
                                                  selectedAddSocialLink ? (
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
                                          )
                                        )}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                  {/*<div className="flex-shrink mt-1 ml-2">
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2.5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                    onClick={handleAddSocialLink}
                                    disabled={
                                      selectedAddSocialLink.type_id === -1
                                    }
                                  >
                                    Add
                                  </button>
                                  </div>*/}
                                </div>
                              </div>
                            </>
                          )}
                        </Listbox>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 pt-3 md:pb-14">
                    <label
                      htmlFor="websiteValue"
                      className="text-gray-700 text-sm"
                    >
                      <FontAwesomeIcon
                        className="h-5 w-5 mr-2 hidden"
                        icon={faLink}
                      />
                      Other Website
                    </label>
                    <input
                      name="websiteValue"
                      placeholder="Your URL"
                      value={websiteValue ? websiteValue : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setWebsiteValue(value);
                      }}
                      type="text"
                      className="mt-1 bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              {/* Third column */}
              <div className="flex-1 my-4 md:pl-2">
                <div>
                  <div className="text-xl text-indigo-500 mt-2 pt-2 md:mt-0 md:pt-0 mb-3">
                    Page Settings
                  </div>
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
                  <div className="py-2 mb-16">
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
                  </div>
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
