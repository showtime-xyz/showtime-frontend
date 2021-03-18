import { useContext, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import { emailRegex } from "../lib/regex";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";

const ModalAddEmail = ({ isOpen, setEmailModalOpen }) => {
    const context = useContext(AppContext);
    const [emailValue, setEmailValue] = useState(null);
    const [emailError, setEmailError] = useState("");
    const handleSubmit = async (event) => {
        setEmailError("");
        event.preventDefault();
        mixpanel.track("Save email");
        if (emailRegex.test(emailValue)) {
            try {
                const authRequest = await fetch("/api/addwallet", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                    }),
                });
                console.log(authRequest);
                setEmailModalOpen(false);
            } catch (err) {
                setEmailError("We're having trouble registering this email")
            }
        } else {
            setEmailError("Enter a valid email address")
        }
    };
    return (
        <>
            {isOpen && (
                <ClientOnlyPortal selector="#modal">
                    <div className="backdrop" onClick={() => setEmailModalOpen(false)}>
                        <div
                            className="modal"
                            style={{ color: "black" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSubmit}>
                                <CloseButton setEditModalOpen={setEmailModalOpen} />
                                <div className="text-3xl border-b-2 pb-2">Add Email</div>
                                <div className="mt-4">
                                    <label htmlFor="email">
                                        Email Address
                                        {" "}
                                        <span
                                            style={{ fontWeight: 400, color: "#999", fontSize: 12 }}
                                        >
                                            (Connect email to your wallet address)
                                        </span>
                                    </label>
                                    <input
                                        name="email"
                                        placeholder="example@gmail.com"
                                        value={emailValue ? emailValue : ""}
                                        autoFocus
                                        onChange={(e) => {
                                            setEmailValue(e.target.value);
                                        }}
                                        type="text"
                                        maxLength="50"
                                        className="w-full mt-1 mb-1"
                                        style={{
                                            color: "black",
                                            padding: 10,
                                            borderRadius: 7,
                                            borderWidth: 2,
                                            borderColor: "#999",
                                            fontSize: 15,
                                        }}
                                    />
                                    <div
                                        style={{
                                            color: "red",
                                            fontSize: 12,
                                            visibility: emailError ? "visible" : "hidden",
                                        }}
                                        className="text-right mb-2"
                                    >
                                        &nbsp;{emailError}
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
                                                setEmailModalOpen(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
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
                        `}
                        </style>
                    </div>
                </ClientOnlyPortal>
            )}
        </>
    );
}

export default ModalAddEmail;
