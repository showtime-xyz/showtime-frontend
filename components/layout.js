import Head from "next/head";
import PropTypes from "prop-types";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:image" content={"/logo.svg"} />
        <meta name="og:title" content="siteTitle" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="keywords" content="showtime, ethereum, token, nft" />
      </Head>

      <Header user={user} />

      <main className="w-10/12 mx-auto">{children}</main>

      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
