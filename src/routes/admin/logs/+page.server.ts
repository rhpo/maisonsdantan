import type { PageServerLoad } from './$types';
import { getLogs } from '$lib/server/db/logs';

export const load: PageServerLoad = async () => {
	const logs = await getLogs();
	return { logs };
};
