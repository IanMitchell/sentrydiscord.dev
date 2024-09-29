import { Fragment, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import * as Fathom from "fathom-client";
import "tailwindcss/tailwind.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    // Fathom.load("EJVBCWAV", {
    //   includedDomains: ["{siteUrl}"],
    //   url: "https://owl.sentrydiscord.dev/script.js",
    // });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Sentry → Discord</title>
        <meta name="title" content="Sentry → Discord" />
        <meta
          name="description"
          content="Forward Sentry event notifications to your Discord server using Webhooks"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="{siteUrl}/" />
        <meta property="og:title" content="Sentry → Discord" />
        <meta
          property="og:description"
          content="Forward Sentry event notifications to your Discord server using Webhooks"
        />
        <meta
          property="og:image"
          content="{siteUrl}/share.png"
        />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}
