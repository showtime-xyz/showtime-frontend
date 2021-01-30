import { useRouter } from "next/router";
import { useEffect } from "react";
import { Magic } from "magic-sdk";
import Head from "next/head";
import WalletButton from "../components/WalletButton";
import Layout from "../components/layout";
import mixpanel from "mixpanel-browser";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Login page view");
  }, []);

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
      router.push("/");
    } else {
      /* handle errors */
    }
  };

  return (
    <Layout>
      <Head>
        <title>Showtime | Login</title>
        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />
        <meta property="og:image" content="/banner.png" />
        <meta name="og:title" content="Showtime | Login" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Showtime | Login" />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />
        <meta
          name="twitter:image"
          content="https://showtime.kilkka.vercel.app/banner.png"
        />
      </Head>
      <div className="text-center">
        <div className="text-3xl mt-10">Select a login method:</div>
        <form onSubmit={handleSubmit}>
          <br />
          <br />
          <label htmlFor="email" className="pb-4 ">
            Email (with Magic Link)
          </label>
          <br />
          <br />
          <input
            name="email"
            placeholder="Email"
            type="email"
            className="border-2"
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
