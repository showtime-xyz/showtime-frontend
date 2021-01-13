import Head from "next/head";
//import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout from "../components/layout";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  return (
    <Layout>
      <Head>
        <title>Digital Art</title>
      </Head>
      <h1
        className="showtime-title text-center mx-auto"
        style={{ maxWidth: 1000 }}
      >
        Discover and showcase your favorite digital art
      </h1>
      <>
        <div className="flex justify-center">
          {user ? (
            <Link href="/profile">
              <a className="showtime-pink-button-outline">Go to My Profile</a>
            </Link>
          ) : (
            <button className="showtime-pink-button">
              Continue with Email
            </button>
          )}
        </div>
      </>

      {/*<Link href="/login">
        <a>Login</a>
      </Link>
  <h1>Welcome to Showtime!</h1>*/}
    </Layout>
  );
}
