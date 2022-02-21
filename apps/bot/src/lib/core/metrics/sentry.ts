import { getCacheValue } from "./cache";
import database from "../database";

export async function getTotalEventCount() {
	const value = await getCacheValue<number>("totalEventCount", async () => {
		const events = await database.event.count();

		return events ?? 0;
	});

	return value;
}
