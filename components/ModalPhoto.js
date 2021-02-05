import { useContext, useState, useEffect, useRef } from "react";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import "croppie/croppie.css";
import Croppie from "croppie";

export default function Modal({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);

  {
    /*
  const [nameValue, setNameValue] = useState(null);

  useEffect(() => {
    if (context.myProfile) {
      setNameValue(context.myProfile.name);
    }
  }, [context.myProfile]);

  const handleSubmit = async (event) => {
    mixpanel.track("Save profile name edit");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/editname`, {
      method: "post",
      body: JSON.stringify({
        name: nameValue,
      }),
    });

    context.setMyProfile({
      ...context.myProfile,
      name: nameValue ? (nameValue.trim() ? nameValue.trim() : null) : null, // handle names with all whitespaces
    });
    setEditModalOpen(false);
  };
*/
  }

  const [image, setImage] = useState("");
  const [croppie, setCroppie] = useState(null);

  const formRef = useRef();

  function handleImage(image) {
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
      croppieInstance.bind({
        url: image,
      });
      setCroppie(croppieInstance);
    } else {
    }
  }

  function handleSubmit(event) {
    mixpanel.track("Save photo edit");
    event.preventDefault();
    if (croppie !== null) {
      croppie
        .result({
          type: "base64",
          size: {
            width: 480,
            height: 480,
          },
          format: "jpeg",
          //rotate: 90,
        })
        .then((blob) => {
          console.log(blob);

          // post to the api here

          // if successful
          setEditModalOpen(false);
          setCroppie(null);
          setImage("");
        });
    }
  }

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
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop"
            onClick={() => {
              setEditModalOpen(false);
              if (croppie) {
                croppie.destroy();
              }
              setCroppie(null);
              setImage("");
            }}
          >
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="text-3xl border-b-2 pb-2">Edit photo</div>
                <div className="my-8">
                  {image === "" && (
                    <div>
                      {/* Your image upload functionality here */}
                      {/*<ImageUpload image={image} setImage={handleImage} />*/}

                      <div
                        className="showtime-pink-button text-sm text-center my-16"
                        style={{ cursor: "pointer" }}
                        onClick={handleClick}
                      >
                        Upload a picture
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

                  <div style={{ maxWidth: 368 }}>
                    <div id="image-helper"></div>
                  </div>

                  {image !== "" && (
                    <div
                      className="text-sm"
                      onClick={() => {
                        if (croppie) {
                          croppie.destroy();
                        }
                        setCroppie(null);
                        setImage("");
                      }}
                      style={{ fontWeight: 400, cursor: "pointer", width: 90 }}
                    >
                      Clear
                    </div>
                  )}
                </div>
                <div className="border-t-2 pt-4">
                  <button
                    type="submit"
                    className="showtime-green-button px-5 py-3 float-right"
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
                    //onClick={() => setEditModalOpen(false)}
                    disabled={image === ""}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="showtime-black-button-outline px-5 py-3"
                    onClick={() => {
                      setEditModalOpen(false);
                      if (croppie) {
                        croppie.destroy();
                      }

                      setCroppie(null);
                      setImage("");
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
