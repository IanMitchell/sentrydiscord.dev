import type {
	FastifyInstance,
	FastifyPluginOptions,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
} from "fastify";
import type { Server } from "http";
import getLogger from "../../lib/logging";

const log = getLogger("Sentry Routes");

export default function shieldRoutes(
	server: FastifyInstance<
		Server,
		RawRequestDefaultExpression<Server>,
		RawReplyDefaultExpression<Server>
	>,
	options: FastifyPluginOptions,
	done: (err?: Error) => void
) {
	server.post("/event", async (request, response) => {
		log.info("Receiving Sentry Event");
		void response.status(200).send({ success: true });
	});

	done();
}
