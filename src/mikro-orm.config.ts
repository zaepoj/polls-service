import {
	PollAnswerEntity,
	PollEntity,
	PollOptionEntity,
} from "./database/entities";

export default {
	entities: [PollEntity, PollOptionEntity, PollAnswerEntity],
	dbName: "polls",
	type: "postgresql",
};
