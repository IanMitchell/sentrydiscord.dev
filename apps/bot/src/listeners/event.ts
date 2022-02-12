import { CommandArgs } from "../typedefs";

export default async ({ bot }: CommandArgs) => {
	// TODO: impl
	bot.on("interaction", () => {
		console.log("interaction");
	});
};
