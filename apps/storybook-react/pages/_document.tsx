import { getInitialProps } from "@expo/next-adapter/document";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
        </Head>
        <body className="!max-w-screen bg-white dark:bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

Document.getInitialProps = getInitialProps;

export default Document;
