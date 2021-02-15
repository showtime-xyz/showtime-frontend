import { useState } from "react";
import ClientOnlyPortal from "./ClientOnlyPortal";
//import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import CloseButton from "./CloseButton";

export default function Modal({ isOpen, setReportModalOpen, tid }) {
  //const context = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const [confirmationShowing, setConfirmationShowing] = useState(false);

  const handleSubmit = async (event) => {
    mixpanel.track("Submit report item");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/reportitem`, {
      method: "post",
      body: JSON.stringify({
        tid: tid,
        description: inputValue,
      }),
    });

    setConfirmationShowing(true);

    setTimeout(function () {
      setConfirmationShowing(false);
      setReportModalOpen(false);
      setInputValue("");
    }, 1500);
  };
  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop"
            onClick={() => {
              setReportModalOpen(false);
              setInputValue("");
            }}
          >
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <CloseButton setEditModalOpen={setReportModalOpen} />
                <div
                  className="text-3xl border-b-2 pb-2"
                  style={{ fontWeight: 600 }}
                >
                  Report item
                </div>
                {confirmationShowing ? (
                  <div className="my-8">
                    We received your report. Thank you!
                  </div>
                ) : (
                  <>
                    <div className="my-8">
                      <textarea
                        name="details"
                        placeholder="Provide details (optional)"
                        value={inputValue}
                        autoFocus
                        onChange={(e) => {
                          setInputValue(e.target.value);
                        }}
                        type="text"
                        maxLength="200"
                        className="w-full"
                        rows={4}
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
                        Submit
                      </button>
                      <button
                        type="button"
                        className="showtime-black-button-outline px-5 py-3"
                        onClick={() => {
                          setReportModalOpen(false);
                          setInputValue("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
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
