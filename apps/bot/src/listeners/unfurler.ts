import { CommandArgs } from "../typedefs";

// TODO: listen for sentry links and post basic information
export default async ({ bot }: CommandArgs) => {
	// TODO: impl
	bot.on("interaction", () => {
		// check to see if message contains link
		// check to see if preview is on for guild/project
		// get information about issue
		// post embed as reply
		console.log("interaction");
	});
};
