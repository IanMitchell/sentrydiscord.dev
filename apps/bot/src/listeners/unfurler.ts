import { CommandArgs } from "../typedefs";

// TODO: listen for sentry links and post basic information
export default async ({ bot }: CommandArgs) => {
	bot.on("message", (message) => {
		const matches = message.cleanContent.matchAll(
			/sentry\.io\/organizations\/(?<organization>\w+)\/issues\/(?<issue>\d+)/g
		);

		if (matches != null) {
			console.log("Unfurl");
			// TODO: check to see if preview is on for guild/project
			// TODO: get information about issue
			// TODO: post embed as reply
		}
	});
};
