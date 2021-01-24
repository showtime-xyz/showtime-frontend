import { useRouter } from "next/router";
import { Magic } from "magic-sdk";
import WalletButton from "../components/WalletButton";
import Layout from "../components/layout";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (event) => {
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
      router.push("/");
    } else {
      /* handle errors */
    }
  };

  return (
    <Layout>
      <div className="text-center">
        <div className="text-3xl mt-10">Select a login method:</div>
        <form onSubmit={handleSubmit}>
          <br />
          <br />
          <label htmlFor="email" className="pb-4">
            Email (with Magic Link)
          </label>
          <br />
          <br />
          <input
            name="email"
            placeholder="Email"
            type="email"
            style={{ color: "black", padding: 10, borderRadius: 7, width: 300 }}
          />
          <br />
          <br />
          <button className="showtime-pink-button">Log in with Email</button>
        </form>
        <br />
        __________________________________
        <br />
        <br />
        <WalletButton className="bg-white text-black hover:bg-gray-300 rounded-lg py-2 px-5" />
        <br />
        <br />
      </div>
    </Layout>
  );
}
