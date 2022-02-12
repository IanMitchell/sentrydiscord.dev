import fastify from "fastify";
import { register } from "./lib/metrics/grafana";
import cors from "fastify-cors";
import bot from "./bot";
import getLogger from "./lib/logging";
import { createShield } from "./lib/metrics/shields";
import { getTotalGuildCount, getTotalMemberCount } from "./lib/metrics/discord";
import { getException } from "./lib/error";

const server = fastify();
void server.register(cors);

const log = getLogger("Server");

server.get("/shield/guilds", async (request, response) => {
	log.info("Shield: Guilds");
	const value = await getTotalGuildCount();
	return response.send(createShield("Guilds", value.toLocaleString()));
});

server.get("/shield/users", async (request, response) => {
	log.info("Shield: Users");
	const value = await getTotalMemberCount();
	return response.send(createShield("Users", value.toLocaleString()));
});

server.get("/shield/commands", async (request, response) =>
	response.send(
		createShield("Commands", bot.applicationCommands.size.toLocaleString())
	)
);

server.get("/metrics", async (request, response) => {
	try {
		const metrics = await register.metrics();
		await response.header("Content-Type", register.contentType).send(metrics);
	} catch (error: unknown) {
		// TODO: Handle better
		return response.status(500).send(error);
	}
});

export default (async () => {
	try {
		const port = process.env.SERVER_PORT ?? 3030;
		log.info(`Listening on localhost:${port}`);
		await server.listen(port, "0.0.0.0");
	} catch (err: unknown) {
		const error = getException(err);
		log.fatal(error.message);
		// TODO: Sentry
		process.exit(1);
	}
})();
