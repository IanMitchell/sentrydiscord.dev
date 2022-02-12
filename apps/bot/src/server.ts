import fastify from "fastify";
import { register } from "./lib/metrics/grafana";
import cors from "fastify-cors";
import getLogger from "./lib/logging";
import { getException } from "./lib/node/error";
import { Counter } from "prom-client";
import shieldRoutes from "./routes/shield-routes";
import sentryRoutes from "./routes/v1/sentry-routes";

const server = fastify();
void server.register(cors);

const log = getLogger("Server");

void server.register(shieldRoutes);
void server.register(sentryRoutes, { prefix: "/api/v1" });

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
