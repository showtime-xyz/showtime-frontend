import { getInitialProps } from "@expo/next-adapter/document";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {/* preload fonts */}
          <link rel="stylesheet" href="/fonts/showtime.css" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preload"
            href="/fonts/woff2/Afronaut.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        {/* overflow-y-visible resolves applied css reset issue caused by `@expo/next-adapter/document`*/}
        <body className="!max-w-screen overflow-y-visible">
          {/* Here we will mount our modal portal */}
          <div id="modal" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

Document.getInitialProps = getInitialProps;

export default Document;
