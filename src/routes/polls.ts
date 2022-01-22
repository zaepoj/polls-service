import express from "express";
import { resultsHandler } from "../controllers/results";
import { answerPoll, createPoll, getPoll } from "../controllers/polls";

const router = express.Router();

router.post("/", createPoll);
router.get("/:id", getPoll);
router.post("/:id/answer", answerPoll);
router.get("/:id/results", resultsHandler);

export default router;
