import { useContext, useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";

export default function Modal({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);
  const [nameValue, setNameValue] = useState(null);
  const [bioValue, setBioValue] = useState(null);
  const [websiteValue, setWebsiteValue] = useState(null);

  useEffect(() => {
    if (context.myProfile) {
      setNameValue(context.myProfile.name);
      setBioValue(context.myProfile.bio);
      setWebsiteValue(context.myProfile.website_url);
    }
  }, [context.myProfile]);

  const handleSubmit = async (event) => {
    mixpanel.track("Save profile edit");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/editname`, {
      method: "post",
      body: JSON.stringify({
        name: nameValue ? (nameValue.trim() ? nameValue.trim() : null) : null,
        bio: bioValue ? (bioValue.trim() ? bioValue.trim() : null) : null,
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
      website_url: websiteValue
        ? websiteValue.trim()
          ? websiteValue.trim()
          : null
        : null,
    });

    setEditModalOpen(false);
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
                <div
                  className="text-3xl border-b-2 pb-2"
                  style={{ fontWeight: 600 }}
                >
                  Edit profile
                </div>
                <div className="my-8">
                  <label htmlFor="name" style={{ fontWeight: 600 }}>
                    Name
                  </label>
                  <input
                    name="name"
                    placeholder="Your Name"
                    value={nameValue}
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
                    }}
                  />
                  <label htmlFor="bio" style={{ fontWeight: 600 }}>
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
                    value={bioValue}
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
                      height: 160,
                      borderWidth: 2,
                      borderColor: "#999",
                    }}
                  ></textarea>

                  <div
                    className="text-right"
                    style={{ fontSize: 12, fontWeight: 400, color: "#999" }}
                  >
                    160 character limit
                  </div>
                  <label htmlFor="website_url" style={{ fontWeight: 600 }}>
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
                    value={websiteValue}
                    onChange={(e) => {
                      setWebsiteValue(e.target.value);
                    }}
                    type="text"
                    className="w-full mt-1 mb-6"
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,

                      borderWidth: 2,
                      borderColor: "#999",
                    }}
                  />
                </div>
                <div className="border-t-2 pt-4">
                  <button
                    type="submit"
                    className="showtime-green-button px-5 py-3 float-right"
                    style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                    //onClick={() => setEditModalOpen(false)}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="showtime-black-button-outline px-5 py-3"
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
                top: 10%;
                right: 10%;
                left: 10%;
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
