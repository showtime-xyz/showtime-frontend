import { useContext, useState, useEffect } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";

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
  const SHOWTIME_PROD_URL = "alpha.tryshowtime.com/";
  const context = useContext(AppContext);
  const [nameValue, setNameValue] = useState(null);
  const [customURLValue, setCustomURLValue] = useState("");
  const [customURLError, setCustomURLError] = useState({
    isError: false,
    message: "",
  });
  const [bioValue, setBioValue] = useState(null);
  const [websiteValue, setWebsiteValue] = useState(null);

  useEffect(() => {
    if (context.myProfile) {
      setCustomURLValue(context.myProfile.username || "");
      setNameValue(context.myProfile.name);
      setBioValue(context.myProfile.bio);
      setWebsiteValue(context.myProfile.website_url);
    }
  }, [context.myProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    mixpanel.track("Save profile edit");

    const username = customURLValue ? customURLValue.trim() : null;
    const validUsername = await handleUsernameLookup(
      customURLValue,
      context,
      setCustomURLError
    );
    if (!validUsername) {
      return;
    }
    // Post changes to the API
    await fetch(`/api/editname`, {
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
    });

    setEditModalOpen(false);
    const wallet_addresses = context.myProfile?.wallet_addresses;

    router.push(
      `/${username || (wallet_addresses && wallet_addresses[0]) || ""}`
    );
  };
  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop" onClick={() => setEditModalOpen(false)}>
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <CloseButton setEditModalOpen={setEditModalOpen} />
                <div className="text-3xl border-b-2 pb-2">Edit Info</div>
                <div className="mt-4">
                  <label htmlFor="name">Name</label>
                  <input
                    name="name"
                    placeholder="Your name"
                    value={nameValue ? nameValue : ""}
                    autoFocus
                    onChange={(e) => {
                      setNameValue(e.target.value);
                    }}
                    type="text"
                    maxLength="50"
                    className="w-full mt-1 mb-6"
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,
                      borderWidth: 2,
                      borderColor: "#999",
                      fontSize: 15,
                    }}
                  />
                  <label htmlFor="customURL">
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
                      borderWidth: 2,
                      borderColor: "#999",
                      marginBottom: "4px",
                    }}
                    className="mt-1"
                  >
                    <input
                      name="customURL"
                      placeholder="Your custom URL"
                      value={customURLValue ? customURLValue : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const urlRegex = /^[a-zA-Z0-9-]*$/;
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
                        paddingLeft: 170,
                        fontSize: 15,
                      }}
                      autoComplete="false"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        paddingLeft: 10,
                        paddingTop: 11,
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
                      visibility: customURLError.message ? "visible" : "hidden",
                    }}
                    className="text-right"
                  >
                    &nbsp;{customURLError.message}
                  </div>
                  <label htmlFor="bio">
                    About me{" "}
                    <span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>
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
                    className="w-full mt-1"
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,
                      height: context.windowSize?.height < 800 ? 72 : 114,
                      borderWidth: 2,
                      fontSize: 15,
                      borderColor: "#999",
                    }}
                  ></textarea>

                  <div
                    className="text-right"
                    style={{ fontSize: 12, fontWeight: 400, color: "#999" }}
                  >
                    160 character limit
                  </div>
                  <label htmlFor="website_url">
                    Website URL{" "}
                    <span
                      style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    name="website_url"
                    placeholder=""
                    value={websiteValue ? websiteValue : ""}
                    onChange={(e) => {
                      setWebsiteValue(e.target.value);
                    }}
                    type="text"
                    className="w-full mt-1 mb-6"
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,
                      fontSize: 15,
                      borderWidth: 2,
                      borderColor: "#999",
                    }}
                  />
                </div>
                <div className="border-t-2 pt-4">
                  <button
                    type="submit"
                    className="showtime-green-button px-4 py-2 float-right rounded-full"
                    style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                    //onClick={() => setEditModalOpen(false)}
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
                right: 3%;
                left: 3%;
                padding: 1em;
                border-radius: 7px;
                max-width: 400px;
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
