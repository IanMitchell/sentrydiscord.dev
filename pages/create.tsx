import { Fragment, useState } from "react";
import Link from "next/link";
import * as Fathom from "fathom-client";
import Footer from "../components/Footer";
import DonationBanner from "../components/DonationBanner";
import Spinner from "../components/Spinner";
import Copy from "../components/Copy";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="underline text-black">
      {children}
    </a>
  );
}

export default function Create() {
  const [key, setKey] = useState(null);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (event) => {
    setValue(event.currentTarget.value);
  };

  const getWebhookURL = () => `https://sentrydiscord.dev/api/webhooks/${key}`;

  const onClick = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    Fathom.trackGoal("4DROBFHL", 1);

    const response = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ url: value }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();

      setKey(json.key);
      setIsLoading(false);
    } else {
      const json = await response.json();
      setError(json?.error ?? "Something went wrong, please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Link href="/">
        <a className="inline-block mt-5 ml-5 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white">
          &larr; Home
        </a>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <main>
          <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Start by making a Discord Webhook
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Not sure how? Follow{" "}
              <ExternalLink href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks">
                this Discord guide
              </ExternalLink>{" "}
              to create one. Next, enter that URL below and we'll give you a
              unique webhook to add to Sentry.
            </p>

            <div className="bg-white py-12 sm:py-16">
              <div className="relative sm:py-16">
                <div aria-hidden="true" className="hidden sm:block">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-3xl"></div>
                  <svg
                    className="absolute top-8 left-1/2 -ml-3"
                    width="404"
                    height="392"
                    fill="none"
                    viewBox="0 0 404 392"
                  >
                    <defs>
                      <pattern
                        id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="4"
                          height="4"
                          className="text-gray-200"
                          fill="currentColor"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="404"
                      height="392"
                      fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
                    />
                  </svg>
                </div>
                <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                  <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
                    >
                      <svg
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="xMidYMid slice"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 1463 360"
                      >
                        <path
                          className="text-indigo-500 text-opacity-40"
                          fill="currentColor"
                          d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                        />
                        <path
                          className="text-indigo-700 text-opacity-40"
                          fill="currentColor"
                          d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                        />
                      </svg>
                    </div>
                    <div className="relative">
                      <div className="sm:text-center">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                          {key != null ? "Your Sentry Webhook" : "Enter your Discord webhook URL"}
                        </h2>
                        <p className="mt-4 mx-auto max-w-2xl text-lg text-indigo-200">
                          The only information we store is the event platform
                          (language) and time.
                        </p>
                      </div>
                      {isLoading ? (
                        <div className="mt-16 flex justify-center">
                          <Spinner />
                        </div>
                      ) : key == null ? (
                        <Fragment>
                          <form className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                            <div className="min-w-0 flex-1">
                              <label htmlFor="url" className="sr-only">
                                Discord Webhook
                              </label>
                              <input
                                id="url"
                                type="text"
                                value={value}
                                onChange={onChange}
                                className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                placeholder="Discord Webhook URL"
                              />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-3">
                              <button
                                type="submit"
                                onClick={onClick}
                                className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                              >
                                Create
                              </button>
                            </div>
                          </form>
                          {error != null ? (
                            <p className="mt-3 text-center text-sm text-indigo-200">
                              {error}
                            </p>
                          ) : null}
                        </Fragment>
                      ) : (
                        <div className="m-auto sm:max-w-lg">
                          <div className="mt-8 w-full flex shadow items-center justify-center px-5 py-3 border border-transparent font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 flex-row">
                            <p className="w-full font-mono text-lg truncate">
                              {getWebhookURL()}
                            </p>
                            <Copy value={getWebhookURL()} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Finally, add the Webhook Integration to Sentry
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                You can find it under <strong>Settings</strong> &rarr;{" "}
                <strong>Integrations</strong> &rarr; <strong>Webhooks</strong>.
                Add it to your project, and then in the{" "}
                <strong>Configure</strong> screen add the above link to the{" "}
                <strong>Callback URLs</strong>. That's it! Save your changes,
                and click "Test plugin" to see it in action.
              </p>
            </div>
          </div>
        </main>
      </div>
      <DonationBanner />
      <Footer />
    </div>
  );
}
