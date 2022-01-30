import express from "express";
import cors from "cors";
import { MikroORM, EntityManager, EntityRepository } from "@mikro-orm/core";
import polls from "./routes/polls";
import {
	PollAnswerEntity,
	PollEntity,
	PollOptionEntity,
} from "./database/entities";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/polls", polls);

export const DI = {} as {
	orm: MikroORM;
	em: EntityManager;
	pollRepository: EntityRepository<PollEntity>;
	pollOptionRepository: EntityRepository<PollOptionEntity>;
	pollAnswerRepository: EntityRepository<PollAnswerEntity>;
};

app.listen(4011, async () => {
	const orm = await MikroORM.init({
		entities: [PollEntity, PollOptionEntity, PollAnswerEntity],
		dbName: "polls",
		type: "postgresql",
	});

	DI.orm = orm;
	DI.em = orm.em;
	DI.pollRepository = orm.em.getRepository(PollEntity);
	DI.pollOptionRepository = orm.em.getRepository(PollOptionEntity);
	DI.pollAnswerRepository = orm.em.getRepository(PollAnswerEntity);

	console.log("Running latest migrations");
	const migrator = orm.getMigrator();
	await migrator.up();

	console.log("polls-service running on port 4011");
});
