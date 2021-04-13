import { useState } from "react";
import mixpanel from "mixpanel-browser";
import CloseButton from "./CloseButton";
import ScrollableModal from "./ScrollableModal";

export default function Modal({ isOpen, setReportModalOpen, nftId }) {
  //const context = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const [confirmationShowing, setConfirmationShowing] = useState(false);

  const handleSubmit = async (event) => {
    mixpanel.track("Submit report item");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/reportitem_v2`, {
      method: "post",
      body: JSON.stringify({
        nft_id: nftId,
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
        <ScrollableModal
          closeModal={() => {
            setReportModalOpen(false);
            setInputValue("");
          }}
          contentWidth="30rem"
        >
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <CloseButton setEditModalOpen={setReportModalOpen} />
              <div className="text-3xl border-b-2 pb-2">Report item</div>
              {confirmationShowing ? (
                <div className="my-8">We received your report. Thank you!</div>
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
        </ScrollableModal>
      )}
    </>
  );
}
