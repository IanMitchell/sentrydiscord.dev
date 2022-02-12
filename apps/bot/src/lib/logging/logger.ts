import logdna from "@logdna/logger";
import chalk from "chalk";
import debug from "debug";
// import { once } from "events";

type LogFn = (message: string, meta?: Record<string, unknown>) => void;
type Logger = {
	debug: LogFn;
	trace: LogFn;
	info: LogFn;
	warn: LogFn;
	error: LogFn;
	fatal: LogFn;
};

// const logger = logdna.createLogger(process.env.LOGDNA_KEY!, {
// 	app: "aquarius",
// 	level: "info",
// 	indexMeta: true,
// });

if (process.env.NODE_ENV === "production") {
	// logger.info?.("Creating connection to LogDNA");
}

// async function shutdown() {
// 	if (process.env.NODE_ENV === "production" && logger) {
// 		return once(logger, "cleared");
// 	}
// }

// TODO: BROKEN
// process.on("SIGTERM", async () => shutdown());
// process.on("SIGINT", async () => shutdown());

function logLine(message: string, options: logdna.LogOptions) {
	// logger.log(message, options);
	console.log({ message, options });
}

export default function getLogger(name: string): Logger {
	if (process.env.NODE_ENV === "production") {
		return {
			trace: (message, meta) => {
				logLine(message, { meta, level: "trace", app: name });
			},
			debug: (message, meta) => {
				logLine(message, { meta, level: "debug", app: name });
			},
			info: (message, meta) => {
				logLine(message, { meta, level: "info", app: name });
			},
			warn: (message, meta) => {
				logLine(message, { meta, level: "warn", app: name });
			},
			error: (message, meta) => {
				logLine(message, { meta, level: "error", app: name });
			},
			fatal: (message, meta) => {
				logLine(message, { meta, level: "fatal", app: name });
			},
		};
	}

	const log = debug(name);
	log(`created logger ${name}`);

	return {
		trace: (message, _meta) => {
			log(message);
		},
		debug: (message, _meta) => {
			log(message);
		},
		info: (message, _meta) => {
			log(message);
		},
		warn: (message, _meta) => {
			log(chalk.yellow(message));
		},
		error: (message, _meta) => {
			log(chalk.red(message));
		},
		fatal: (message, _meta) => {
			log(chalk.red.bold(message));
		},
	};
}
