import { Request, Response, NextFunction } from "express";
import { getPollAnswerCounts } from "../database/poll";
import { v4 } from "uuid";

interface ResultClient {
	id: string;
	joined: number;
	response: Response;
}

const pollResultListeningClients: {
	[key: string]: { clients: ResultClient[] };
} = {};

/**
 * Creates connection for a client to listen poll result changes
 */

const resultsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const headers = {
			"Content-Type": "text/event-stream",
			Connection: "keep-alive",
			"Cache-Control": "no-cache",
		};

		res.writeHead(200, headers);
		const results = await getPollAnswerCounts(id);

		res.write(`data: ${JSON.stringify(results)}\n\n`);

		if (!pollResultListeningClients[id]) {
			pollResultListeningClients[id] = { clients: [] };
		}

		const clientId = v4();

		pollResultListeningClients[id].clients.push({
			id: clientId,
			joined: Date.now(),
			response: res,
		});

		req.on("close", () => {
			console.log(`${clientId} Connection closed`);
			pollResultListeningClients[id].clients = pollResultListeningClients[
				id
			].clients.filter((client) => client.id !== clientId);
		});
	} catch (e) {
		next(e);
	}
};

/**
 *  Sends live poll results to listening clients
 */

const sendResultsEventToClients = async (pollId: string) => {
	const results = await getPollAnswerCounts(pollId);
	const pollClients = pollResultListeningClients[pollId];

	pollClients.clients.forEach(async (client) => {
		client.response.write(`data: ${JSON.stringify(results)}\n\n`);
	});
};

export { resultsHandler, sendResultsEventToClients };
