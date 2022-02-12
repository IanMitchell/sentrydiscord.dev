import { getCacheValue } from "./cache";
import database from "../core/database";

export async function getTotalEventCount() {
	const value = await getCacheValue<number>("totalEventCount", async () => {
		const events = await database.platform.aggregate({
			_sum: {
				count: true,
			},
		});

		return events._sum.count ?? 0;
	});

	return value;
}
