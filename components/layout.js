import Head from "next/head";
import PropTypes from "prop-types";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <link rel="icon" href="/logo_sm.jpg" />
        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />
        <meta property="og:image" content="/banner.png" />
        <meta
          name="og:title"
          content="Showtime - Discover and showcase digital art"
        />
        <meta name="keywords" content="showtime, ethereum, token, nft" />
      </Head>

      <Header />

      <main className="w-10/12 mx-auto">{children}</main>

      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
