import { useState } from "react";
import ClientOnlyPortal from "./ClientOnlyPortal";
import mixpanel from "mixpanel-browser";
import CloseButton from "./CloseButton";

export default function ModalFeedback({ isOpen, closeModal }) {
  const [inputValue, setInputValue] = useState("");
  const [confirmationShowing, setConfirmationShowing] = useState(false);

  const handleSubmit = async (event) => {
    mixpanel.track("Submit website feedback");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/websitefeedback`, {
      method: "post",
      body: JSON.stringify({
        feedback: inputValue,
      }),
    });

    setConfirmationShowing(true);

    setTimeout(function () {
      setConfirmationShowing(false);
      closeModal();
      setInputValue("");
    }, 2500);
  };
  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop"
            onClick={() => {
              closeModal();
              setInputValue("");
            }}
          >
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <CloseButton setEditModalOpen={closeModal} />
                <div className="text-3xl border-b-2 pb-2">Feedback</div>
                {confirmationShowing ? (
                  <div className="my-8">
                    We have received your feedback. Thank you!
                  </div>
                ) : (
                  <>
                    <div className="my-4">
                      <div className="my-4 mx-1">
                        Please let us know how we can improve Showtime! Every
                        message is reviewed by the team.
                      </div>
                      <textarea
                        name="details"
                        placeholder="Your feedback here..."
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
                        className="showtime-green-button  px-4 py-2  rounded-full float-right"
                        style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                        //onClick={() => setEditModalOpen(false)}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="showtime-black-button-outline  px-4 py-2  rounded-full"
                        onClick={() => {
                          closeModal();
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
