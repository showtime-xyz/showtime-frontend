import { useContext, useState, useRef } from "react";
import mixpanel from "mixpanel-browser";
import "croppie/croppie.css";
import Croppie from "croppie";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import ScrollableModal from "./ScrollableModal";

export default function ModalEditCover({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);

  const [image, setImage] = useState("");
  const [croppie, setCroppie] = useState(null);
  const [saveInProgress, setSaveInProgress] = useState(false);

  const formRef = useRef();

  function handleImage(image) {
    setImage(image);
    const el = document.getElementById("image-helper");
    if (el) {
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        viewport: {
          height: 200,
          width: formRef.width,
          type: "square",
        },
        boundary: {
          height: 280,
          width: formRef.width,
        },
        enableOrientation: true,
      });
      croppieInstance.bind({
        url: image,
      });
      setCroppie(croppieInstance);
    } else {
    }
  }

  const handleSubmit = async (event) => {
    mixpanel.track("Save photo edit");
    if (!saveInProgress) {
      setSaveInProgress(true);
      event.preventDefault();

      try {
        if (croppie !== null) {
          croppie
            .result({
              type: "base64",
              //   size: {
              //     width: 300,
              //     height: 300,
              //   },
              size: "original",
              format: "jpeg",
              circle: false,
            })
            .then((blob) => {
              // Post changes to the API
              fetch(`/api/editcoverphoto`, {
                method: "post",
                body: blob,
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (myJson) {
                  const url = myJson["data"];

                  context.setMyProfile({
                    ...context.myProfile,
                    cover_url: url,
                  });

                  setEditModalOpen(false);
                  if (croppie) {
                    croppie.destroy();
                  }
                  setCroppie(null);
                  setImage("");
                });
            });
        }
      } catch {
      } finally {
        setSaveInProgress(false);
      }
    }
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

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };

  return (
    <>
      {isOpen && (
        <ScrollableModal
          closeModal={() => {
            if (!saveInProgress) {
              setEditModalOpen(false);
              if (croppie) {
                try {
                  croppie.destroy();
                } catch {}
              }
              setCroppie(null);
              setImage("");
            }
          }}
          contentWidth="30rem"
        >
          <div className="p-4">
            <form onSubmit={handleSubmit} ref={formRef}>
              <CloseButton setEditModalOpen={setEditModalOpen} />
              <div className="text-3xl border-b-2 pb-2">Edit Cover Image</div>
              <div className="mt-4 mb-4">
                {image === "" && (
                  <div>
                    {/* Your image upload functionality here */}
                    {/*<ImageUpload image={image} setImage={handleImage} />*/}

                    <div
                      className="showtime-pink-button text-sm text-center mt-16  px-4 py-3  rounded-full"
                      style={{ cursor: "pointer" }}
                      onClick={handleClick}
                    >
                      Upload a photo
                    </div>
                    <div
                      className="text-center text-xs mb-16 mt-4"
                      style={{ fontWeight: 400, color: "#666" }}
                    >
                      Accepts JPEG, PNG, and GIF (non-animated)
                    </div>

                    <input
                      ref={hiddenFileInput}
                      onChange={handleChange}
                      style={{ display: "none" }}
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
                    className="text-sm text-center"
                    onClick={() => {
                      if (!saveInProgress) {
                        if (croppie) {
                          try {
                            croppie.destroy();
                          } catch {}
                        }
                        setCroppie(null);
                        setImage("");
                      }
                    }}
                    style={{ fontWeight: 400, cursor: "pointer" }}
                  >
                    Clear
                  </div>
                )}
              </div>
              <div className="border-t-2 pt-4">
                <button
                  type="submit"
                  className="showtime-green-button  px-4 py-2  rounded-full float-right"
                  style={
                    image === ""
                      ? {
                          borderColor: "#35bb5b",
                          borderWidth: 2,
                          opacity: 0.6,
                          cursor: "not-allowed",
                        }
                      : { borderColor: "#35bb5b", borderWidth: 2, opacity: 1 }
                  }
                  disabled={image === ""}
                >
                  {saveInProgress ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-card-spinner-small" />
                    </div>
                  ) : (
                    "Save changes"
                  )}
                </button>

                <button
                  type="button"
                  className="showtime-black-button-outline  px-4 py-2  rounded-full"
                  onClick={() => {
                    if (!saveInProgress) {
                      setEditModalOpen(false);
                      if (croppie) {
                        try {
                          croppie.destroy();
                        } catch {}
                      }

                      setCroppie(null);
                      setImage("");
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </ScrollableModal>
      )}
    </>
  );
}
