import type {
	FastifyInstance,
	FastifyPluginOptions,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
} from "fastify";
import type { Server } from "http";
import { Counter } from "prom-client";
import handleEvent from "src/handlers/event";
import database from "../../lib/core/database";
import getLogger from "../../lib/core/logging";
import { getInstallationId } from "@ianmitchell/sentry-parser";

const log = getLogger("routes:sentry");

const installationCounter = new Counter({
	name: "total_install_events",
	help: "Total integration installations",
});

const uninstallationCounter = new Counter({
	name: "total_uninstall_events",
	help: "Total integration uninstallations",
});

const eventCounter = new Counter({
	name: "total_event_alert_events",
	help: "Total event alert events",
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

		const json = request.body as Record<string, any>;
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
				const id = getInstallationId(json);
				log.info(`Uninstallation request for ${id}`);
				await database.install.delete({
					where: {
						id,
					},
				});
				break;
			}

			case "event_alert": {
				log.info("Event Alert");
				eventCounter.inc();
				handleEvent(json);
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
