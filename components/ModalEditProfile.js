import { useContext, useState, useEffect } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Select from "react-dropdown-select";

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

export default function Modal({ isOpen, setEditModalOpen }) {
  const router = useRouter();
  const SHOWTIME_PROD_URL = "tryshowtime.com/";
  const context = useContext(AppContext);
  const [nameValue, setNameValue] = useState(null);
  const [customURLValue, setCustomURLValue] = useState("");
  const [customURLError, setCustomURLError] = useState({
    isError: false,
    message: "",
  });
  const [bioValue, setBioValue] = useState(null);
  const [websiteValue, setWebsiteValue] = useState(null);
  const [defaultListId, setDefaultListId] = useState("");

  useEffect(() => {
    if (context.myProfile) {
      setCustomURLValue(context.myProfile.username || "");
      setNameValue(context.myProfile.name);
      setBioValue(context.myProfile.bio);
      setWebsiteValue(context.myProfile.website_url);
      setDefaultListId(context.myProfile.default_list_id || "");
    }
  }, [context.myProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        default_list_id: defaultListId ? defaultListId : "",
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
      default_list_id: defaultListId ? defaultListId : "",
    });

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

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop" onClick={() => setEditModalOpen(false)}>
            <div
              className="modal flex flex-col overflow-hidden"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
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
                    <div className="text-xl text-purple-500">Profile</div>
                    <div className="py-2">
                      <label htmlFor="name" className="text-gray-500 text-sm">
                        Name
                      </label>
                      <input
                        name="name"
                        placeholder="Your name"
                        value={nameValue ? nameValue : ""}
                        //autoFocus
                        onChange={(e) => {
                          setNameValue(e.target.value);
                        }}
                        type="text"
                        maxLength="50"
                        className="w-full mt-1 mb-6 border-2 border-gray-400 px-3 "
                        style={{
                          color: "black",
                          borderRadius: 7,
                          fontSize: 16,
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      />
                      <label
                        htmlFor="customURL"
                        className="text-gray-500  text-sm"
                      >
                        Custom URL{" "}
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
                          marginBottom: "4px",
                        }}
                        className="mt-1 border-2 border-gray-400"
                      >
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
                          maxLength={30}
                          className="w-full"
                          style={{
                            color: "black",
                            borderRadius: 7,
                            padding: 10,
                            paddingLeft: 140,
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
                          {SHOWTIME_PROD_URL}
                        </div>
                      </div>
                      <div
                        style={{
                          color: customURLError.isError ? "red" : "#35bb5b",
                          fontSize: 12,
                          visibility: customURLError.message
                            ? "visible"
                            : "hidden",
                        }}
                        className="text-right"
                      >
                        &nbsp;{customURLError.message}
                      </div>
                      <label htmlFor="bio" className="text-gray-500 text-sm">
                        About me (optional)
                      </label>
                      <textarea
                        name="bio"
                        placeholder=""
                        value={bioValue ? bioValue : ""}
                        onChange={(e) => {
                          setBioValue(e.target.value);
                        }}
                        type="text"
                        maxLength="160"
                        className="w-full mt-1 border-2 border-gray-400 px-3"
                        style={{
                          color: "black",
                          borderRadius: 7,
                          height: 114,
                          fontSize: 16,

                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      ></textarea>

                      <div
                        className="text-right text-gray-500"
                        style={{ fontSize: 12, fontWeight: 400 }}
                      >
                        160 character limit
                      </div>
                      <label
                        htmlFor="website_url"
                        className="text-gray-500 text-sm"
                      >
                        Website URL (optional)
                      </label>
                      <input
                        name="website_url"
                        placeholder=""
                        value={websiteValue ? websiteValue : ""}
                        onChange={(e) => {
                          setWebsiteValue(e.target.value);
                        }}
                        type="text"
                        className="w-full mt-1 border-2 border-gray-400 px-3 "
                        style={{
                          color: "black",
                          borderRadius: 7,
                          fontSize: 16,

                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-4 flex-shrink" />
                  <div className="my-4 flex-1">
                    <div className="text-xl text-purple-500">Page Settings</div>
                    <div className="py-2  mb-12">
                      <label className="text-gray-500 text-sm">
                        Default NFT List
                      </label>

                      <Select
                        options={tab_list}
                        labelField="name"
                        valueField="value"
                        values={tab_list.filter(
                          (item) => item.value === defaultListId
                        )}
                        searchable={false}
                        onChange={(values) =>
                          setDefaultListId(values[0]["value"])
                        }
                        style={{
                          fontSize: 16,
                          borderWidth: 2,
                          borderRadius: 4,
                          borderColor: "rgb(156, 163, 175)",
                          paddingRight: 8,
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t-2 pt-4">
                  <button
                    type="submit"
                    className="showtime-green-button px-4 py-2 float-right rounded-full"
                    style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="showtime-black-button-outline px-4 py-2  rounded-full"
                    onClick={() => {
                      setEditModalOpen(false);
                      setNameValue(context.myProfile.name);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <style jsx>{`
              :global(body) {
                overflow: hidden;
              }
              .backdrop {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
              .modal {
                background-color: white;
                position: absolute;
                top: ${context.isMobile ? 2 : 10}%;
                ${context.isMobile ? "bottom:  2%;" : " "}
                right: 3%;
                left: 3%;
                border-radius: 7px;
                max-width: 700px;
                margin-left: auto;
                margin-right: auto;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
