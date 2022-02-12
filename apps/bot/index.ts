import dotenv from "dotenv";
import Sentry from "./src/lib/logging/sentry";
import getLogger from "./src/lib/logging/logger";
import { getException } from "./src/lib/node/error";

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
