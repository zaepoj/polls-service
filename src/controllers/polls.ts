import { Request, Response, NextFunction } from "express";
import {
  findPollById,
  getPollAnswerCounts,
  savePoll,
  savePollAnswer,
} from "../database/poll";
import { sendResultsEventToClients } from "./results";

interface CreatePollInput {
  title: string;
  options: PollOptionInput[];
}

interface PollOptionInput {
  value: string;
  type: string;
}

const createPoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body;
    console.log(input);
    const pollId = await savePoll(req.body);
    res.send({ pollId });
  } catch (e) {
    next(e);
  }
};

const getPoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const poll = await findPollById(id);
    res.send(poll);
  } catch (e) {
    next(e);
  }
};

const answerPoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    await savePollAnswer({ pollId: id, optionId });
    await getPollAnswerCounts(id);

    // send result event to listening clients
    sendResultsEventToClients(id);
    res.status(201).send();
  } catch (e) {
    next(e);
  }
};

export { createPoll, getPoll, answerPoll };
