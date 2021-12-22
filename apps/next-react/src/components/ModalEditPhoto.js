import { useState, useRef } from "react";
import mixpanel from "mixpanel-browser";
import "croppie/croppie.css";
import Croppie from "croppie";
import CloseButton from "./CloseButton";
import ScrollableModal from "./ScrollableModal";
import GhostButton from "./UI/Buttons/GhostButton";
import GreenButton from "./UI/Buttons/GreenButton";
import axios from "@/lib/axios";
import useProfile from "@/hooks/useProfile";

export default function Modal({ isOpen, setEditModalOpen }) {
  const { myProfile, setMyProfile } = useProfile();

  const [image, setImage] = useState("");
  const [croppie, setCroppie] = useState(null);
  const [saveInProgress, setSaveInProgress] = useState(false);

  const formRef = useRef();

  const handleImage = (image) => {
    setImage(image);
    const el = document.getElementById("image-helper");
    if (el) {
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        viewport: {
          height: 250,
          width: 250,
          type: "circle",
        },
        boundary: {
          height: 280,
          width: formRef.width,
        },
        enableOrientation: true,
      });
      croppieInstance.bind({ url: image });
      setCroppie(croppieInstance);
    }
  };

  const handleRemovePhoto = () => {
    setSaveInProgress(true);
    axios
      .post("/api/profile/avatar")
      .then((res) => res.data)
      .then(({ data: emptyUrl }) => {
        setMyProfile({ ...myProfile, img_url: emptyUrl });
        setEditModalOpen(false);
        setSaveInProgress(false);
      });
  };

  const submitPhoto = () => {
    try {
      if (croppie !== null) {
        croppie
          .result({
            type: "base64",
            size: {
              width: 1200,
              height: 1200,
            },
            format: "jpeg",
            circle: false,
          })
          .then((blobString) => {
            // Post changes to the API
            axios
              .post("/api/profile/avatar", { image: blobString })
              .then((res) => res.data)
              .then(({ data: url }) => {
                setMyProfile({ ...myProfile, img_url: url });

                setEditModalOpen(false);

                if (croppie) croppie.destroy();
                setCroppie(null);
                setImage("");
                setSaveInProgress(false);
              });
          });
      }
    } catch (e) {
      setSaveInProgress(false);
    }
  };

  const handleSubmit = () => {
    mixpanel.track("Save photo edit");
    setSaveInProgress(true);
    submitPhoto();
  };

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        handleImage(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const clearForm = () => {
    if (!saveInProgress) {
      if (croppie) {
        try {
          croppie.destroy();
        } catch (e) {
          console.error(e);
        }
      }
      setCroppie(null);
      setImage("");
    }
  };

  return (
    <>
      {isOpen && (
        <ScrollableModal
          closeModal={() => {
            if (!saveInProgress) {
              clearForm();
              setEditModalOpen(false);
            }
          }}
          contentWidth="30rem"
        >
          <div className="p-4">
            <div ref={formRef}>
              <CloseButton
                cleanupFunction={clearForm}
                setEditModalOpen={setEditModalOpen}
              />
              <div className="dark:text-gray-300 text-3xl border-b-2 dark:border-gray-800 pb-2">
                Edit Photo
              </div>
              <div className="mt-4 mb-4">
                {image === "" && (
                  <div>
                    <div
                      className="border-2 border-transparent text-white dark:text-gray-900 bg-stpink hover:border-stpink hover:bg-transparent hover:text-stpink dark:hover:text-stpink transition text-center mt-16  px-4 py-3  rounded-full cursor-pointer"
                      onClick={handleClick}
                    >
                      Upload a photo
                    </div>
                    <div className="text-center text-xs mb-16 mt-4 text-gray-700 dark:text-gray-600">
                      Accepts JPEG, PNG, and GIF (non-animated)
                    </div>

                    <input
                      ref={hiddenFileInput}
                      className="hidden"
                      id="profilePic"
                      type="file"
                      onChange={onChangePicture}
                    />
                  </div>
                )}

                <div className="w-full">
                  <div id="image-helper"></div>
                </div>

                {image !== "" && (
                  <div
                    className="dark:text-gray-400 text-sm text-center cursor-pointer"
                    onClick={clearForm}
                  >
                    Clear
                  </div>
                )}
              </div>

              <div className="border-t-2 dark:border-gray-800 pt-4 flex flex-row items-center">
                <div>
                  <GhostButton
                    onClick={() => {
                      if (!saveInProgress) {
                        setEditModalOpen(false);
                        clearForm();
                      }
                    }}
                  >
                    Cancel
                  </GhostButton>
                </div>

                {myProfile?.img_url && (
                  <div
                    className="dark:text-gray-400 text-sm ml-4 cursor-pointer"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </div>
                )}
                <div className="flex-grow"></div>
                <div>
                  <GreenButton
                    loading={saveInProgress}
                    onClick={handleSubmit}
                    className={image === "" ? "opacity-60" : ""}
                    disabled={image === "" || saveInProgress}
                  >
                    Save
                  </GreenButton>
                </div>
              </div>
            </div>
          </div>
        </ScrollableModal>
      )}
    </>
  );
}
