import type {
	FastifyInstance,
	FastifyPluginOptions,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
} from "fastify";
import type { Server } from "http";
import { Counter } from "prom-client";
import getLogger from "../../lib/logging";

const log = getLogger("routes:sentry");

const installationCounter = new Counter({
	name: "total_installs",
	help: "Total integration installations",
});

const uninstallationCounter = new Counter({
	name: "total_uninstalls",
	help: "Total integration uninstallations",
});

export default function sentryRoutes(
	server: FastifyInstance<
		Server,
		RawRequestDefaultExpression<Server>,
		RawReplyDefaultExpression<Server>
	>,
	options: FastifyPluginOptions,
	done: (err?: Error) => void
) {
	server.post("/webhook", async (request, response) => {
		log.info("Receiving Sentry Event");

		const type = request.headers["Sentry-Hook-Resource"];

		switch (type) {
			case "installation": {
				log.info("Installation request");
				break;
			}

			case "uninstallation": {
				log.info("Uninstallation request");
				break;
			}

			case "event_alert": {
				log.info("Event Alert");
				break;
			}

			case "metric_alert": {
				log.info("Metric Alert");
				break;
			}

			case "issue": {
				log.info("Issue request");
				break;
			}

			case "error": {
				log.info("Error request");
				break;
			}

			default: {
				log.warn(`Unknown Sentry Event Type: ${type}`);
			}
		}

		void response.status(200).send({ success: true });
	});

	done();
}
