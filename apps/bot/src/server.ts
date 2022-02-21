import fastify from "fastify";
import { register } from "./lib/core/metrics/grafana";
import cors from "fastify-cors";
import getLogger from "./lib/core/logging";
import { getException } from "./lib/core/node/error";
import shieldRoutes from "./routes/shield-routes";
import sentryRoutes from "./routes/v1/sentry-routes";

const server = fastify();
void server.register(cors);

const log = getLogger("server");

void server.register(shieldRoutes);
void server.register(sentryRoutes, { prefix: "/v1" });

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
