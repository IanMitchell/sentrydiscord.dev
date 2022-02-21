import { getCacheValue } from "./cache";
import bot from "../../../bot";

export async function getTotalGuildCount() {
	const value = await getCacheValue<number>("totalGuildCount", async () => {
		const guilds = await bot.guilds.fetch();
		return guilds.size;
	});

	return value;
}

export async function getTotalMemberCount() {
	const value = await getCacheValue<number>("memberCount", async () => {
		const guilds = await bot.guilds.fetch();

		let sum = 0;
		for (const partialGuild of guilds.values()) {
			const guild = await partialGuild.fetch();
			sum += guild.approximateMemberCount ?? 0;
		}

		return sum;
	});

	return value;
}
