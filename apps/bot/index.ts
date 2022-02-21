import dotenv from "dotenv";
import Sentry from "./src/lib/core/logging/sentry";
import getLogger from "./src/lib/core/logging/logger";
import { getException } from "./src/lib/core/node/error";

dotenv.config({ path: "../../../.env" });
const log = getLogger("host");

async function initialize() {
	try {
		log.info("Loading Bot");
		await import("./src/bot");

		log.info("Starting Server");
		await import("./src/server");
	} catch (err: unknown) {
		const error = getException(err);
		log.fatal(error.message, { error });
		Sentry.captureException(error);
		process.exit(1);
	}
}

void initialize();
