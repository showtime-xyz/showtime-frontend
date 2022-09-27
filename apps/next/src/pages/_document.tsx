import React from "react";
import { AppRegistry } from "react-native";

import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    AppRegistry.registerComponent("Main", () => Main);
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication("Main");
    const styles = [getStyleElement()];

    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps, styles: React.Children.toArray(styles) };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
            rel="stylesheet"
          />
        </Head>
        {/* Prevent the web app to move on browsers like Safari on iOS */}
        <body className="!max-w-screen fixed top-0 bottom-0 left-0 right-0 md:relative">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
