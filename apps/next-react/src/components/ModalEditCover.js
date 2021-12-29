import { useState, useRef } from "react";
import mixpanel from "mixpanel-browser";
import "croppie/croppie.css";
import Croppie from "croppie";
import CloseButton from "./CloseButton";
import ScrollableModal from "./ScrollableModal";
import axios from "@/lib/axios";
import GhostButton from "./UI/Buttons/GhostButton";
import GreenButton from "./UI/Buttons/GreenButton";
import Button from "./UI/Buttons/Button";
import useProfile from "@/hooks/useProfile";

export default function ModalEditCover({ isOpen, setEditModalOpen }) {
  const { myProfile, setMyProfile } = useProfile();

  const [image, setImage] = useState("");
  const [croppie, setCroppie] = useState(null);
  const [saveInProgress, setSaveInProgress] = useState(false);

  const formRef = useRef();

  const handleImage = (image) => {
    setImage(image);
    const el = document.getElementById("image-helper");
    if (el && formRef.current?.clientWidth) {
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        viewport: {
          height: formRef.current?.clientWidth / 5,
          width: formRef.current?.clientWidth,
          type: "square",
        },
        boundary: {
          height: 280,
          width: formRef.current?.clientWidth,
        },
        enableOrientation: true,
      });
      croppieInstance.bind({
        url: image,
        zoom: 0,
      });
      setCroppie(croppieInstance);
    }
  };

  const handleRemovePhoto = () => {
    setSaveInProgress(true);
    axios
      .post("/api/profile/cover")
      .then((res) => res.data)
      .then(({ data: emptyUrl }) => {
        setMyProfile({ ...myProfile, cover_url: emptyUrl });
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
              width: 2880,
              height: 576,
            },
            //size: "original",
            //quality: 0.75,
            format: "jpeg",
            circle: false,
          })
          .then((blobString) => {
            // Post changes to the API
            axios
              .post("/api/profile/cover", { image: blobString })
              .then((res) => res.data)
              .then(({ data: url }) => {
                setMyProfile({ ...myProfile, cover_url: url });

                setEditModalOpen(false);
                setSaveInProgress(false);
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

  const handleClickUpload = () => {
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
              <div className="dark:text-gray-300 text-2xl border-b-2 dark:border-gray-800 pb-2">
                Edit Cover Image
              </div>
              <div className="mt-4 mb-4">
                {image === "" && (
                  <div className="my-16">
                    <Button
                      style="primary"
                      className="w-full justify-center"
                      onClick={handleClickUpload}
                    >
                      Upload cover image
                    </Button>
                    <div className="text-center text-xs mt-4 text-gray-700 dark:text-gray-500">
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
                    className="text-sm text-center cursor-pointer dark:text-gray-400"
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

                {myProfile?.cover_url && (
                  <div
                    className="text-sm dark:text-gray-400 ml-4 cursor-pointer"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </div>
                )}
                <div className="flex-grow"></div>
                <div>
                  <GreenButton
                    onClick={handleSubmit}
                    loading={saveInProgress}
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
