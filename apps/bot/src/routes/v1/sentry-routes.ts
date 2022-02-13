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
	name: "total_install_events",
	help: "Total integration installations",
});

const uninstallationCounter = new Counter({
	name: "total_uninstall_events",
	help: "Total integration uninstallations",
});

const unsupportedCounter = new Counter({
	name: "total_unsupported_events",
	help: "Total unsupported events",
});

const unknownCounter = new Counter({
	name: "total_unknown_events",
	help: "Total unknown events",
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

		let type = request.headers["Sentry-Hook-Resource"] ?? "";
		if (Array.isArray(type)) {
			type = type.join("");
		}

		switch (type) {
			case "installation": {
				installationCounter.inc();
				log.info("Installation request");
				break;
			}

			case "uninstallation": {
				uninstallationCounter.inc();
				log.info("Uninstallation request");

				// Remove Installation
				// If Guild has no other installations, post message with a "leave" button

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
				unsupportedCounter.inc();
				log.info("Issue request");
				break;
			}

			case "error": {
				unsupportedCounter.inc();
				log.info("Error request");
				break;
			}

			default: {
				unknownCounter.inc();
				log.warn(`Unknown Sentry Event Type: ${type}`);
			}
		}

		void response.status(200).send({ success: true });
	});

	done();
}
