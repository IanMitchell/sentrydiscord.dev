import { CommandArgs } from "../typedefs";

// TODO: listen for sentry links and post basic information
export default async ({ bot }: CommandArgs) => {
	// TODO: impl
	bot.on("interaction", () => {
		console.log("interaction");
	});
};
