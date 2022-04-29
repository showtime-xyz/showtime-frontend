import { getInitialProps } from "@expo/next-adapter/document";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

// TODO: Error: `getInitialProps` in Document component is not supported with `concurrentFeatures` enabled.

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
        </Head>
        <body className="!max-w-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

Document.getInitialProps = getInitialProps;

export default Document;
