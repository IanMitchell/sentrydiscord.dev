import { collectDefaultMetrics, Gauge } from "prom-client";
import { getTotalGuildCount, getTotalMemberCount } from "./discord";

collectDefaultMetrics({
	prefix: "app_name",
});

export const totalGuilds = new Gauge({
	name: "guild_total",
	help: "The total number of Guilds the bot is in",
	async collect() {
		const value = await getTotalGuildCount();
		this.set(value);
	},
});

export const totalMembers = new Gauge({
	name: "member_total",
	help: "the total number of members in joined guilds",
	async collect() {
		const value = await getTotalMemberCount();
		this.set(value);
	},
});

export { register } from "prom-client";
