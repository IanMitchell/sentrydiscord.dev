import type {
	FastifyInstance,
	FastifyPluginOptions,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
} from "fastify";
import type { Server } from "http";
import { createShield } from "../lib/metrics/shields";
import getLogger from "../lib/logging";
import {
	getTotalGuildCount,
	getTotalMemberCount,
} from "../lib/metrics/discord";

const log = getLogger("Shield Routes");

export default function shieldRoutes(
	server: FastifyInstance<
		Server,
		RawRequestDefaultExpression<Server>,
		RawReplyDefaultExpression<Server>
	>,
	options: FastifyPluginOptions,
	done: (err?: Error) => void
) {
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

	// TODO: Implement
	server.get("/shield/events", async (request, response) =>
		response.send(createShield("Events Handled", Number(0).toLocaleString()))
	);

	done();
}
