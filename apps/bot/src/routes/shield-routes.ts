import type {
	FastifyInstance,
	FastifyPluginOptions,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
} from "fastify";
import type { Server } from "http";
import { createShield } from "../lib/core/metrics/shields";
import getLogger from "../lib/core/logging";
import {
	getTotalGuildCount,
	getTotalMemberCount,
} from "../lib/core/metrics/discord";
import { getTotalEventCount } from "../lib/core/metrics/sentry";

const log = getLogger("routes:shields");

export default function shieldRoutes(
	server: FastifyInstance<
		Server,
		RawRequestDefaultExpression<Server>,
		RawReplyDefaultExpression<Server>
	>,
	options: FastifyPluginOptions,
	done: (err?: Error) => void
) {
	server.get("/shields/guilds", async (request, response) => {
		log.info("Shield: Guilds");
		const value = await getTotalGuildCount();
		return response.send(createShield("Guilds", value.toLocaleString()));
	});

	server.get("/shields/users", async (request, response) => {
		log.info("Shield: Users");
		const value = await getTotalMemberCount();
		return response.send(createShield("Users", value.toLocaleString()));
	});

	server.get("/shield/events", async (request, response) => {
		const value = await getTotalEventCount();
		return response.send(
			createShield("Events Handled", value.toLocaleString())
		);
	});

	done();
}
