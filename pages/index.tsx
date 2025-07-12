import Link from "next/link";
import prisma from "../lib/database";
import * as Fathom from "fathom-client";
import Footer from "../components/Footer";
import Question, { QuestionExternalLink } from "../components/Questions";
import Stat from "../components/Stat";
import DonationBanner from "../components/DonationBanner";

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

export default function Home({ events, webhooks }) {
	const onStartClick = () => {
		Fathom.trackGoal("JS44EPR1", 1);
	};

	return (
		<div className="relative bg-gray-50 overflow-hidden">
			<div
				className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
				aria-hidden="true"
			>
				<div className="relative h-full max-w-7xl mx-auto">
					<svg
						className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
						width="404"
						height="784"
						fill="none"
						viewBox="0 0 404 784"
					>
						<defs>
							<pattern
								id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
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
							height="784"
							fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
						/>
					</svg>
				</div>
			</div>

			<div className="relative pt-6">
				<main className="mt-16 sm:mt-24">
					<div className="text-center px-4">
						<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
							<span className="block text-sentry xl:inline">Sentry</span>
							<span className="block xl:inline"> &rarr; </span>
							<span className="block text-blurple xl:inline"> Discord</span>
						</h1>
						<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
							Forward Sentry webhook notifications to your Discord server. No
							sign-up required!
						</p>
						<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
							<div className="rounded-md shadow">
								<Link
									href="/create"
									onClick={onStartClick}
									className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
								>
									Get started
								</Link>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 pt-8 sm:pt-12">
						<div className="mt-10 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="max-w-4xl mx-auto">
								<dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-2">
									<Stat title="Forwarded Events" value={events} />
									<Stat title="Registered Webhooks" value={webhooks} />
								</dl>
							</div>
						</div>
					</div>

					<div className="rounded-md bg-red-50 p-4 max-w-4xl mx-auto mb-8">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-red-400"
									aria-hidden="true"
									viewBox="0 0 16 16"
								>
									<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
								</svg>
							</div>
						</div>
					</div>

					<DonationBanner />

					<div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
						<div className=" mt-12 mb-16 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
							<div className="relative">
								<h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
									Want an example?
								</h3>
								<p className="mt-3 text-lg text-gray-500">
									This is the default "test notification" sent by Sentry. Want
									to see more information? Maybe less?{" "}
									<ExternalLink href="https://github.com/ianmitchell/sentrydiscord.dev">
										Let us know on GitHub!
									</ExternalLink>
								</p>

								<dl className="mt-10 space-y-10">
									<div className="flex">
										<div className="flex-shrink-0">
											<div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
												<svg
													className="h-6 w-6"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
										</div>
										<div className="ml-4">
											<dt className="text-lg leading-6 font-medium text-gray-900">
												Inline Code Snippets
											</dt>
											<dd className="mt-2 text-base text-gray-500">
												The embed will highlight the line of code where the
												error happened, and include surrounding lines to give
												you additional context.
											</dd>
										</div>
									</div>

									<div className="flex">
										<div className="flex-shrink-0">
											<div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
												<svg
													className="h-6 w-6"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
													/>
												</svg>
											</div>
										</div>
										<div className="ml-4">
											<dt className="text-lg leading-6 font-medium text-gray-900">
												Event Tags
											</dt>
											<dd className="mt-2 text-base text-gray-500">
												All of the event tags and contexts will be added as
												inline embed fields to give you more information about
												the error at a glance.
											</dd>
										</div>
									</div>

									<div className="flex">
										<div className="flex-shrink-0">
											<div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
												<svg
													className="h-6 w-6"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M13 10V3L4 14h7v7l9-11h-7z"
													/>
												</svg>
											</div>
										</div>
										<div className="ml-4">
											<dt className="text-lg leading-6 font-medium text-gray-900">
												No Waiting
											</dt>
											<dd className="mt-2 text-base text-gray-500">
												We translate and send the Sentry webhook as soon as we
												get it, so you get notified as soon as possible!
											</dd>
										</div>
									</div>
								</dl>
							</div>

							<div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
								<img
									className="relative mx-auto rounded-lg shadow-xl"
									width="490"
									src="/example.png"
									alt="Example Screenshot"
								/>
							</div>
						</div>
					</div>

					<div className="bg-indigo-700">
						<div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
							<h2 className="text-3xl font-extrabold text-white">
								Common Questions
							</h2>
							<div className="mt-6 border-t border-indigo-300 border-opacity-25 pt-10">
								<dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12">
									<Question title="Do you store the Sentry event?">
										<p>
											We don't store the event payload, but we do keep track of
											the platform (language) for the event, when the event was
											received, and what webhook received the event. We use this
											information to prioritize support for popular languages as
											well as to potentially prune unused webhooks.
										</p>

										<p className="mt-4">
											Embeds that fail to send are logged for 24 hours to assist
											with debugging - this data is only used for fixing bugs
											and is not otherwise viewed.
										</p>
									</Question>

									<Question title="Want a native integration?">
										Me too! There's an{" "}
										<QuestionExternalLink href="https://github.com/getsentry/sentry/issues/10925">
											open issue on GitHub
										</QuestionExternalLink>{" "}
										that you can go and leave reactions on to help get it
										prioritized. If official support lands, this service will
										likely stop allowing new registrations but will remain up so
										long as webhooks are receiving events.
									</Question>

									<Question title="Why doesn't the embed include [thing]?">
										I've tried to add what I view as useful information, but if
										you think I've missed something please open an issue on
										GitHub!
									</Question>

									<Question title="Have a feature request or want to report a bug?">
										Awesome! You can file an issue on the{" "}
										<QuestionExternalLink href="https://github.com/ianmitchell/sentrydiscord.dev">
											GitHub repository
										</QuestionExternalLink>
									</Question>
								</dl>
							</div>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const [eventCount, webhookCount] = await Promise.all([
		prisma.event.count({
			select: {
				_all: true,
			},
		}),
		prisma.webhook.count({
			select: {
				_all: true,
			},
		}),
	]);
	await prisma.$disconnect();

	return {
		revalidate: 60,
		props: {
			events: eventCount?._all ?? 0,
			webhooks: webhookCount?._all ?? 0,
		},
	};
}
