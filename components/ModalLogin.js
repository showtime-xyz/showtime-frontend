import { useContext, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import { Magic } from "magic-sdk";
import AppContext from "../context/app-context";
import WalletButton from "../components/WalletButton";
import CloseButton from "./CloseButton";

export default function Modal({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);

  const handleSubmit = async (event) => {
    mixpanel.track("Login - email button click");
    event.preventDefault();

    const { elements } = event.target;

    // the magic code
    const did = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
    ).auth.loginWithMagicLink({ email: elements.email.value });

    // Once we have the did from magic, login with our own API
    const authRequest = await fetch("/api/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${did}` },
    });

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      mixpanel.track("Login success - email");
      //router.push("/");

      const getUserFromCookies = async () => {
        // log in with our own API
        const userRequest = await fetch("/api/user");
        try {
          const user_data = await userRequest.json();
          context.setUser(user_data);

          mixpanel.identify(user_data.publicAddress);
          if (user_data.email) {
            mixpanel.people.set({
              $email: user_data.email, // only reserved properties need the $
              USER_ID: user_data.publicAddress, // use human-readable names
              //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
              //"credits": 150    // ...or numbers
            });
          } else {
            mixpanel.people.set({
              //$email: user_data.email, // only reserved properties need the $
              USER_ID: user_data.publicAddress, // use human-readable names
              //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
              //"credits": 150    // ...or numbers
            });
          }
        } catch {
          // Not logged in
          // Switch from undefined to null
          context.setUser(null);
        }
      };

      const getMyInfo = async () => {
        // get our likes
        const myInfoRequest = await fetch("/api/myinfo");
        try {
          const my_info_data = await myInfoRequest.json();

          context.setMyLikes(my_info_data.data.likes);
          context.setMyFollows(my_info_data.data.follows);
          context.setMyProfile(my_info_data.data.profile);
        } catch {}
      };

      if (!context?.user) {
        getUserFromCookies();
        getMyInfo();
      }

      //setEditModalOpen(false);
      context.setLoginModalOpen(false);
    } else {
      /* handle errors */
    }
  };

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop"
            onClick={() => context.setLoginModalOpen(false)}
          >
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <CloseButton setEditModalOpen={context.setLoginModalOpen} />
                <div
                  className="text-3xl border-b-2 pb-2 text-center"
                  style={{ fontWeight: 600 }}
                >
                  Sign in / Sign up
                </div>
                <div className="text-center pt-8">
                  <label
                    htmlFor="email"
                    className="pb-4 "
                    style={{ fontWeight: 600 }}
                  >
                    Please enter your email:
                  </label>
                  <br />
                  <br />
                  <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    className="border-2 w-full"
                    autoFocus
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,
                    }}
                  />
                  <br />
                  <br />
                  <button className="showtime-pink-button">
                    Sign in with Email
                  </button>
                  <div className="pt-4" style={{ color: "#444", fontSize: 13 }}>
                    You will receive a sign in link in your inbox
                  </div>
                  <div className="py-8" style={{ color: "#444" }}>
                    — or —
                  </div>
                </div>
              </form>

              <div className="mb-4 text-center">
                <WalletButton className="bg-white text-black hover:bg-gray-300 rounded-lg py-2 px-5" />
              </div>
              {/*<div className="border-t-2 pt-4">
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
                  </div>*/}
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
                right: 5%;
                left: 5%;
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
